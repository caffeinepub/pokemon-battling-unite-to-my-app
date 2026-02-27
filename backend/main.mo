import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import Iter "mo:core/Iter";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Types ────────────────────────────────────────────────────────────────

  public type UserProfile = {
    ninjaName : Text;
    clanName : Text;
    avatarUrl : ?Text;
    victories : Nat;
    dojoSeals : Nat;
    crystalInventory : CrystalInventory;
  };

  public type CrystalInventory = {
    flame : Nat;
    tide : Nat;
    gale : Nat;
    thunder : Nat;
    terra : Nat;
    void : Nat;
  };

  public type Monster = {
    monsterName : Text;
    level : Nat;
    masteryElement : ?ElementalMastery;
    battleTechniques : [NinjaTechnique];
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [MonsterImage];
  };

  public type ElementalMastery = {
    #water : Text;
    #fire : Text;
    #lightning : Text;
    #wind : Text;
    #earth : Text;
    #ice : Text;
    #dark : Text;
    #dawn : Text;
    #dusk : Text;
    #hydration : Text;
    #kingRock : Text;
    #magmarizer : Text;
    #magnetizer : Text;
    #metalCoat : Text;
    #moonStone : Text;
    #ovalStone : Text;
    #prismScale : Text;
    #protector : Text;
    #seaScale : Text;
    #shineStone : Text;
    #skyScale : Text;
    #upgrade : Text;
  };

  public type NinjaTechnique = {
    name : Text;
    power : Nat;
    effect : ?TechniqueEffect;
  };

  public type TechniqueEffect = {
    #boostAttack;
    #boostSpeed;
    #boostDefense;
    #paralyzeOpponent;
    #confuseOpponent;
  };

  public type MonsterTeam = [Monster];
  public type PlayerParty = [Monster];

  public type GameState = {
    monsters : [Monster];
    challenger : Text;
    isPrimaryMonster : Bool;
    isChallengerMonster : Bool;
    isTrainerMonster : Bool;
    isWildMonster : Bool;
  };

  type Rankings = [Text];
  type BattleResult = {
    #challengerWin;
    #trainerWin;
    #draw;
    #pending;
    #ongoing;
    #invalid;
    #error;
  };

  type StoryArc = {
    name : Text;
    episodes : [StoryEpisode];
    currentEpisode : ?StoryEpisode;
  };

  type StoryEpisode = {
    locations : [Text];
    battles : [BattleLog];
    trainerBattles : [MonsterTeamBattle];
    wildMonsters : [Monster];
    dojoBattles : [MonsterTeamBattle];
    victoryBattle : ?Text;
    storyIntro : ?Text;
    storyOutro : ?Text;
  };

  type MonsterRoster = {
    monsterRoster : [Monster];
    dojoSeals : [dojoSeal];
    storyArcProgress : [Text];
    inventory : [ElementalMastery];
    battleHistory : [BattleLog];
  };

  type MonsterTeamBattle = {
    trainer : Text;
    team : [Monster];
  };

  type MonsterTechniqueBattle = {
    name : Text;
    type_ : Text;
    power : Nat;
    effect : ?TechniqueEffect;
    isActive : Bool;
    isUsed : Bool;
  };

  type MonsterImage = {
    image : Blob.Blob;
    isAnimated : Bool;
    imageUrl : Text;
    imagePath : Text;
    isRawImage : Bool;
  };

  type BattleLog = {
    challenger : Text;
    battleResult : BattleResult;
    message : Text;
  };

  type BattleMonster = {
    monsterName : Text;
    level : Nat;
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [MonsterImage];
    stats : BattleStats;
    battleTechniques : [NinjaTechnique];
  };

  type BattleStats = {
    attacks : [TechniqueInstance];
    health : Nat;
    powerUps : [TechniqueInstance];
    status : BattleStatus;
  };

  type TechniqueInstance = {
    name : Text;
    attackStrength : AttackStrengths;
    boostAttack : Bool;
    boostDefense : Bool;
    boostSpeed : Bool;
  };

  type BattleStatus = {
    isBerserk : Bool;
    isFatigued : Bool;
    isPoisoned : Bool;
    isParalyzed : Bool;
    isConfused : Bool;
    isShielded : Bool;
    isAmped : Bool;
    isCursed : Bool;
    isLocked : Bool;
  };

  type AttackStrengths = {
    lightning : Nat;
    fire : Nat;
    ice : Nat;
    water : Nat;
    wind : Nat;
    earth : Nat;
    dragon : Nat;
    psychic : Nat;
    fighting : Nat;
    rock : Nat;
    steel : Nat;
    fairy : Nat;
    normal : Nat;
    ground : Nat;
    poison : Nat;
    bug : Nat;
    flying : Nat;
    ghost : Nat;
    dark : Nat;
  };

  type BattleMonsterPersistent = {
    monsterName : Text;
    level : Nat;
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [MonsterImage];
    stats : BattleStats;
    battleTechniques : [NinjaTechnique];
  };

  public type MonsterUltimate = {
    monsterName : Text;
    monsterId : Nat;
    stage : Text;
    images : [MonsterImage];
    attack : Nat;
    defense : Nat;
    speed : Nat;
    agility : Nat;
    reactions : Nat;
    shenanigans : Nat;
  };

  type dojoSeal = Text;

  // ── State ────────────────────────────────────────────────────────────────

  let battleMonsters = Map.empty<Text, BattleMonster>();
  let battleMonsterPersistent = Map.empty<Text, BattleMonsterPersistent>();

  let userProfiles = Map.empty<Principal, UserProfile>();
  // Unique player count, uses Principals as keys so each player is only counted once.
  let uniquePlayers = Map.empty<Principal, ()>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // ── User Profile ─────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Crystal Inventory ────────────────────────────────────────────────────

  public shared ({ caller }) func addCrystal(crystalType : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add crystals");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?existing) { existing };
      case (null) { Runtime.trap("User profile not found") };
    };

    let newInventory = switch (crystalType) {
      case ("flame") {
        { profile.crystalInventory with flame = profile.crystalInventory.flame + quantity };
      };
      case ("tide") {
        { profile.crystalInventory with tide = profile.crystalInventory.tide + quantity };
      };
      case ("gale") {
        { profile.crystalInventory with gale = profile.crystalInventory.gale + quantity };
      };
      case ("thunder") {
        { profile.crystalInventory with thunder = profile.crystalInventory.thunder + quantity };
      };
      case ("terra") {
        { profile.crystalInventory with terra = profile.crystalInventory.terra + quantity };
      };
      case ("void") {
        { profile.crystalInventory with void = profile.crystalInventory.void + quantity };
      };
      case (_) {
        Runtime.trap("Invalid crystal type");
      };
    };

    let updatedProfile = { profile with crystalInventory = newInventory };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCrystalInventory() : async [(Text, Nat)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view crystal inventory");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    [
      ("flame", profile.crystalInventory.flame),
      ("tide", profile.crystalInventory.tide),
      ("gale", profile.crystalInventory.gale),
      ("thunder", profile.crystalInventory.thunder),
      ("terra", profile.crystalInventory.terra),
      ("void", profile.crystalInventory.void),
    ];
  };

  // ── Pages ────────────────────────────────────────────────────────────────

  public query ({ caller }) func getDojoSeals() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view dojo seals");
    };
    [];
  };

  public query ({ caller }) func getLog() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view battle logs");
    };
    [];
  };

  public query ({ caller }) func getUltimateMonsters() : async [MonsterUltimate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view ultimate monsters");
    };
    [];
  };

  public query ({ caller }) func getMonsters() : async [Monster] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view monsters");
    };
    [];
  };

  public query ({ caller }) func getOpponent(type_ : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get opponent info");
    };
    "";
  };

  public query ({ caller }) func getMonsterDXData(monster : Text) : async ?Monster {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view monster DX data");
    };
    null;
  };

  // ── Player Tracking ──────────────────────────────────────────────────────

  public shared ({ caller }) func recordPlayerLogin() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can record their login");
    };
    switch (uniquePlayers.get(caller)) {
      case (null) {
        uniquePlayers.add(caller, ());
      };
      case (?_) {};
    };
  };

  public query func getTotalPlayers() : async Nat {
    uniquePlayers.size();
  };

  // ── Stripe Integration ───────────────────────────────────────────────────

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};

import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Types ─────────────────────────────────────────────────────────────────

  public type UserProfile = {
    ninjaName : Text;
    clanName : Text;
    avatarUrl : ?Text;
    victories : Nat;
    dojoSeals : Nat;
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

  let battleMonsters = Map.empty<Text, BattleMonster>();
  let battleMonsterPersistent = Map.empty<Text, BattleMonsterPersistent>();

  // ── User Profile ──────────────────────────────────────────────────────────

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // ── Query endpoints ───────────────────────────────────────────────────────

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
};

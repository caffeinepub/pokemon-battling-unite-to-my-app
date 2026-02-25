import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── User Profile ──────────────────────────────────────────────────────────

  public type UserProfile = {
    trainerName : Text;
    avatarUrl : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Types ─────────────────────────────────────────────────────────────────

  type Pokemon = {
    name : Text;
    level : Nat;
    evolutionStone : ?PokemonEvolutionStone;
    moves : [PokemonMove];
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [PokemonImage];
  };

  type PokemonEvolutionStone = {
    #waterStone : Text;
    #fireStone : Text;
    #electricStone : Text;
    #grassStone : Text;
    #iceStone : Text;
    #darkStone : Text;
    #dawnStone : Text;
    #duskStone : Text;
    #fireSTONE : Text;
    #hydrationStone : Text;
    #kingRock : Text;
    #leafStone : Text;
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
    #thunderStone : Text;
    #upgrade : Text;
  };

  type PokemonMove = {
    name : Text;
    power : Nat;
    effect : ?MoveEffect;
  };

  type MoveEffect = {
    #boostAttack;
    #boostSpeed;
    #boostDefense;
    #paralyzeOpponent;
    #confuseOpponent;
  };

  public type PokemonTeam = [Pokemon];
  public type PlayerParty = [Pokemon];

  type GameState = {
    pokemon : [Pokemon];
    challenger : Text;
    isPrimaryPokemon : Bool;
    isChallengerPokemon : Bool;
    isTrainerPokemon : Bool;
    isWildPokemon : Bool;
  };

  type BattleLog = {
    challenger : Text;
    battleResult : BattleResult;
    message : Text;
  };

  public type BattlePokemon = {
    name : Text;
    level : Nat;
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [PokemonImage];
    stats : BattleStats;
    moves : [PokemonMove];
  };

  public type BattleStats = {
    attacks : [MoveInstance];
    health : Nat;
    powerUps : [MoveInstance];
    status : BattleStatus;
  };

  public type AttackStrengths = {
    electric : Nat;
    fire : Nat;
    ice : Nat;
    water : Nat;
    grass : Nat;
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

  public type MoveInstance = {
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

  type Score = Text;
  type Rankings = [Text];
  type Badge = Text;
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
    trainerBattles : [PokemonTeamBattle];
    wildPokemon : [Pokemon];
    gymBattles : [PokemonTeamBattle];
    victoryBattle : ?Text;
    storyIntro : ?Text;
    storyOutro : ?Text;
  };

  type PokemonRoster = {
    pokemonRoster : [Pokemon];
    badges : [Badge];
    storyArcProgress : [Text];
    inventory : [PokemonEvolutionStone];
    battleHistory : [BattleLog];
  };

  type PokemonTeamBattle = {
    trainer : Text;
    team : [Pokemon];
  };

  type PokemonMoveBattle = {
    name : Text;
    type_ : Text;
    power : Nat;
    effect : ?MoveEffect;
    isActive : Bool;
    isUsed : Bool;
  };

  type PokemonImage = {
    image : Blob.Blob;
    isAnimated : Bool;
    imageUrl : Text;
    imagePath : Text;
    isRawImage : Bool;
  };

  type BattlePokemonPersistent = {
    name : Text;
    level : Nat;
    baseAttack : Nat;
    baseDefense : Nat;
    baseSpeed : Nat;
    images : [PokemonImage];
    stats : BattleStats;
    moves : [PokemonMove];
  };

  public type PokemonUltimate = {
    name : Text;
    id : Nat;
    stage : Text;
    images : [PokemonImage];
    attack : Nat;
    defense : Nat;
    speed : Nat;
    agility : Nat;
    reactions : Nat;
    shenanigans : Nat;
  };

  let battlePokemon = Map.empty<Text, BattlePokemon>();
  let battlePokemonPersistent = Map.empty<Text, BattlePokemonPersistent>();

  // ── Query endpoints ───────────────────────────────────────────────────────

  public query ({ caller }) func getBadges() : async [Badge] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };
    getPokemonRoster().badges;
  };

  public query ({ caller }) func getLog() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view battle logs");
    };
    getBattleHistory().battles.map(func(x) { x.challenger });
  };

  public query ({ caller }) func getUltimatePokemon() : async [PokemonUltimate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view ultimate Pokemon");
    };
    battlePokemonPersistent.keys().map(func(x) { convertPokemonToUltimate(battlePokemonPersistent.get(x)) }).toArray();
  };

  public query ({ caller }) func getPokemon() : async [Pokemon] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view Pokemon");
    };
    getPokemonRoster().pokemonRoster;
  };

  public query ({ caller }) func getOpponent(type_ : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get opponent info");
    };
    switch (type_) {
      case ("eliteFour") { "Elite_4" };
      case ("olympicChampion") { getOlympicChampion() };
      case (_) { getJohtoChampion() };
    };
  };

  public query ({ caller }) func getTrainerPokemon(pokemonId : Nat) : async ?BattlePokemonPersistent {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view trainer Pokemon");
    };
    let name = pokemonId.toText();
    if (not battlePokemon.containsKey(name)) { Runtime.trap("Pokemon does not exist") };
    battlePokemonPersistent.get(name);
  };

  public query ({ caller }) func getBattlePokemonQuery(pokemon : Text) : async ?BattlePokemonPersistent {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view battle Pokemon");
    };
    switch (battlePokemonPersistent.get(pokemon)) {
      case (?bp) { ?bp };
      case (null) { Runtime.trap("Pokemon does not exist") };
    };
  };

  public query ({ caller }) func getStrategyResponse() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get strategy responses");
    };
    "NOT_DONE_YET";
  };

  public query ({ caller }) func getPersistent() : async BattlePokemonPersistent {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get persistent data");
    };
    switch (battlePokemonPersistent.keys().toArray().size()) {
      case (0) { Runtime.trap("No Pokemon found") };
      case (_) {
        switch (battlePokemonPersistent.get("0")) {
          case (?battlePersistent) { battlePersistent };
          case (_) { Runtime.trap("First persistent Pokemon not found") };
        };
      };
    };
  };

  public query ({ caller }) func getPokemonDXData(pokemon : Text) : async ?Pokemon {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view Pokemon DX data");
    };
    switch (battlePokemon.get(pokemon)) {
      case (?p) { ?convertBattlePokemon(p) };
      case (_) { Runtime.trap("Pokemon does not exist") };
    };
  };

  public query ({ caller }) func hasStatus(status : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check status");
    };
    true;
  };

  // ── Shared (mutating) endpoints ───────────────────────────────────────────

  public shared ({ caller }) func evolvePokemon() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can evolve Pokemon");
    };
    addBadge("Evolved Pokemon");
  };

  public shared ({ caller }) func updateOpponent() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update opponent");
    };
    updateLogs();
    updateBattleStates();
  };

  public shared ({ caller }) func updateTrainerParty() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update trainer party");
    };
    updateLogs();
    updateBattleStates();
  };

  public shared ({ caller }) func createBattleLog(challenger : Text, result : BattleResult) : async BattleLog {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create battle logs");
    };
    { challenger; battleResult = result; message = "BATTLE_MAGICAL_SENSEI_CHALLENGE" };
  };

  public shared ({ caller }) func getPokemonData() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get Pokemon data");
    };
    updateBattleStates();
    updateLogs();
  };

  public shared ({ caller }) func updatePokemon(pokemon : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update Pokemon");
    };
    if (not battlePokemon.containsKey(pokemon)) { Runtime.trap("Pokemon does not exist") };
    true;
  };

  public shared ({ caller }) func updateMoves() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update moves");
    };
  };

  public shared ({ caller }) func updateStats() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update stats");
    };
    ["BESERKER"];
  };

  public shared ({ caller }) func updateMusic() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update music");
    };
  };

  public shared ({ caller }) func updateDialogs() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update dialogs");
    };
  };

  public shared ({ caller }) func notifyBattleResult() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can notify battle results");
    };
    addBadge("Battle result");
  };

  public shared ({ caller }) func challengeEliteFour() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can challenge the Elite Four");
    };
    addBadge("Elite Four");
    "Elite_4";
  };

  public shared ({ caller }) func challengeGymLeader() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can challenge gym leaders");
    };
    addBadge("Gym Badge");
    getJohtoGymLeader();
  };

  public shared ({ caller }) func challengeUltimateChampion() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can challenge the ultimate champion");
    };
    addBadge("Champion Badge");
    getOlympicChampion();
  };

  public shared ({ caller }) func getStoryArc() : async StoryArc {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access story arcs");
    };
    if (getCurrentGameState().pokemon.isEmpty()) {
      getStoryArcByName("Johto Journeys");
    } else {
      getStoryArcByName("Master Journeys");
    };
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  func convertBattlePokemon(view : BattlePokemon) : Pokemon {
    {
      name = view.name;
      level = view.level;
      evolutionStone = null;
      moves = view.moves;
      baseAttack = view.baseAttack;
      baseDefense = view.baseDefense;
      baseSpeed = view.baseSpeed;
      images = view.images;
    };
  };

  func addBadge(_badge : Badge) {
    updatePokemonRoster();
  };

  func updatePokemonRoster() {};

  func updateGameState() {
    updateBattleStates();
    updateLogs();
  };

  func updateBattleStates() {
    updateLogs();
  };

  func updateLogs() {};

  func getJohtoChampion() : Text {
    "JohtoChampion";
  };

  func getOlympicChampion() : Text {
    "MagicalSensei";
  };

  func getJohtoGymLeader() : Text {
    "JohtoGymLeader";
  };

  func getPokemonRoster() : PokemonRoster {
    {
      pokemonRoster = [];
      badges = [];
      storyArcProgress = [];
      inventory = [];
      battleHistory = [];
    };
  };

  func getBattleHistory() : StoryEpisode {
    {
      locations = [];
      battles = [];
      trainerBattles = [];
      wildPokemon = [];
      gymBattles = [];
      victoryBattle = null;
      storyIntro = ?"Intro Text";
      storyOutro = ?"Outro Text";
    };
  };

  func getCurrentGameState() : GameState {
    {
      pokemon = [];
      challenger = "";
      isPrimaryPokemon = false;
      isChallengerPokemon = false;
      isTrainerPokemon = false;
      isWildPokemon = false;
    };
  };

  func getStoryArcByName(name : Text) : StoryArc {
    if (name == "Johto Journeys") {
      {
        name = "Johto Journeys";
        episodes = [];
        currentEpisode = null;
      };
    } else {
      {
        name = "Master Journeys";
        episodes = [];
        currentEpisode = null;
      };
    };
  };

  func convertPokemonToUltimate(pokemon : ?BattlePokemonPersistent) : PokemonUltimate {
    switch (pokemon) {
      case (?p) {
        {
          name = p.name;
          id = p.level;
          stage = p.level.toText();
          images = p.images;
          attack = 1000;
          defense = 1000;
          speed = 1000;
          agility = 1000;
          reactions = 1001;
          shenanigans = 1001;
        };
      };
      case (null) {
        {
          name = "Ash";
          id = 2;
          stage = "LEGENDARY";
          images = [];
          attack = 1000;
          defense = 1000;
          speed = 1000;
          agility = 1000;
          reactions = 1001;
          shenanigans = 1001;
        };
      };
    };
  };
};

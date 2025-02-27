// scripts/main.ts
import { system, world } from "@minecraft/server";
function PFEHourTimeDownEvents() {
  let currentTime = new Date(Date.now());
  let allPlayers = world.getAllPlayers();
  let randomPlayer = allPlayers.at(Math.abs(Math.round(Math.random() * (allPlayers.length - 1))));
  randomPlayer?.dimension.spawnEntity("poke_cassette:cassette_trader", randomPlayer.location).runCommand(`spreadplayers ~ ~ 30 40 @s ~10`);
}
function PFETimeValidation() {
  let currentTime = new Date(Date.now());
  if (currentTime.getMinutes() == 0) {
    PFEHourTimeDownEvents();
  } else {
    system.runTimeout(() => {
      PFETimeValidation();
    }, Math.abs(60 - new Date(Date.now()).getSeconds()) * 20);
  }
}
world.beforeEvents.worldInitialize.subscribe((data) => {
  system.runTimeout(() => {
    PFETimeValidation();
  }, Math.abs(60 - new Date(Date.now()).getSeconds()) * 20);
  data.itemComponentRegistry.registerCustomComponent(
    "poke_cassette:cassette",
    {
      onUse(data2) {
        const id = data2.itemStack.typeId;
        const trackId = id.substring(id.lastIndexOf("_")).substring(1);
        if (data2.source.isSneaking) {
          data2.source.queueMusic(`poke.record.${trackId}`);
          data2.source.playSound("poke.cassette_activate");
          data2.source.sendMessage({ translate: `translation.poke_cassette:trackQueued` });
          return;
        } else {
          data2.source.playMusic(`poke.record.${trackId}`, { fade: 2.5 });
          data2.source.playSound("poke.cassette_activate");
        }
        return;
      }
    }
  );
  return;
});

//# sourceMappingURL=../debug/main.js.map

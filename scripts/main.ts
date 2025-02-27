import { system, world, ItemComponentUseEvent} from "@minecraft/server";

function PFEHourTimeDownEvents() {
    let currentTime = new Date(Date.now())
    //Cassette Trader spawning
    //console.warn(`Attempting to spawn cassette trader`)
    let allPlayers = world.getAllPlayers()
    let randomPlayer = allPlayers.at(Math.abs(Math.round(Math.random() * (allPlayers.length-1))))
    randomPlayer?.dimension.spawnEntity('poke_cassette:cassette_trader',randomPlayer.location).runCommand(`spreadplayers ~ ~ 30 40 @s ~10`)
}
function PFETimeValidation(){
    let currentTime = new Date(Date.now())
    if (currentTime.getMinutes() == 0){
        PFEHourTimeDownEvents()
    }else{
        system.runTimeout(()=>{
            PFETimeValidation()
        },Math.abs(60 -new Date(Date.now()).getSeconds())*20)
    }
}
//Custom Component Registry
world.beforeEvents.worldInitialize.subscribe(data => {
    system.runTimeout(()=>{
        PFETimeValidation()
    },Math.abs(60 -new Date(Date.now()).getSeconds())*20);
    data.itemComponentRegistry.registerCustomComponent(
        "poke_cassette:cassette", {
            onUse(data:ItemComponentUseEvent){
                const id = data.itemStack!.typeId
                const trackId = id.substring(id.lastIndexOf("_")).substring(1)
                if (data.source.isSneaking){
                    data.source.queueMusic(`poke.record.${trackId}`)
                    data.source.playSound('poke.cassette_activate')
                    data.source.sendMessage({translate:`translation.poke_cassette:trackQueued`})
                    return;
                }else{
                    data.source.playMusic(`poke.record.${trackId}`,{fade:2.5})
                    data.source.playSound('poke.cassette_activate')
                }
                return;
            }
        }
    );
    return;
})
import alt from 'alt-server';
import { registerCmd } from '../systems/chat';


registerCmd('uc', '', uc);
function uc(player, args) {
    alt.emitClient(player, 'CU::Init')
}

alt.onClient('CU::Mods:Install', (player, mods) => {
    if (player.vehicle === null) return;
    try{
        if (player.vehicle.modKit != 1) player.vehicle.modKit = 1;
        mods.map((mod, index) => {
            player.vehicle.setMod(index, mod.value)
        })
    }catch(err){}
})

alt.on('playerLeftVehicle', (player) => {
    alt.emitClient(player, 'CU::Close')
})


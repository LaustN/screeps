/**
 * Do we have spawn cycles to spare?
 * Iterate nearby room names - adjacent first, then diagonals
 *  Can we see the room?
 *    spawn a scout if not
 *  Is target room in local memory?
 *    Default the local memory if not
 *  Does the room contain energy sources?
 *    spawn a harvester for each
 *  Does the room contain full containers?
 *    spawn a collector for each multiplied by room-range
 *  
 * 
 */
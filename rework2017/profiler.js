module.exports = function(profilerLabel) {
  var profiler = {
    Label : profilerLabel,
    StartTick : Game.cpu.getUsed(),
    CurrentTick : Game.cpu.getUsed(),
    log: function(label){
      var oldTick = this.CurrentTick;
      this.CurrentTick = Game.cpu.getUsed();
      console.log(""+ profilerLabel + ":" + label + ":" + (this.CurrentTick - oldTick));
    }
  }
  return profiler;
}

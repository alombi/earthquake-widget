async function getEarthquakes(){
   var request = await new Request("https://ingv.alombi.xyz/latest")
   var response = await request.loadJSON()
   data = response.events
   let events = []
   for(var i = 0; i < data.length; i++){
     events.push(Number(data[i].mag))
   }
   let index = events.indexOf(Math.max(...events))
   return data[index]
}
 
function createWidget(event){
   // defining colors
   const colors = {"red":"#FF3B30", "orange":"#FD8208", "yellow":"#FEC309"}
   let w = new ListWidget()
   //w.backgroundColor = new Color("#1C1C1E")
   let title = w.addText("Latest earthquake in Italy")
   title.font = Font.regularRoundedSystemFont(12)
   //title.textColor = new Color("#FFFFFF")
   w.addSpacer(5)
   let region = w.addText(`${event.region.split(" [")[0]} - ${event.mag} Mg`)
   region.font = Font.boldRoundedSystemFont(15)
   region.textColor = new Color(colors[event.color])
   w.addSpacer(10)
   let footerStack = w.addStack()
   let date = footerStack.addText(`${event.time.split("T")[0]}`)
   date.font = Font.mediumRoundedSystemFont(12)
   footerStack.addSpacer()
   let symbol = footerStack.addImage(SFSymbol.named("waveform.path.ecg").image)
symbol.tintColor = Color.dynamic(Color.black(), Color.white())
   symbol.imageSize = new Size(17, 17)
   if(config.widgetFamily === "medium"){
      title.font = Font.regularRoundedSystemFont(15)
      region.font = Font.boldRoundedSystemFont(18)
   }
   return w
}
 
const event = await getEarthquakes()
if(config.runsInWidget){
   let widget = createWidget(event)
   Script.setWidget(widget)
   Script.complete()
}

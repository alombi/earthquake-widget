const key = 'KEY_HERE';
 
// defining colors
const colors = {"red":"#FF3B30", "orange":"#FD8208", "yellow":"#FEC309"}  


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

 
async function createWidget(event, img){
   let w = new ListWidget();
   if(config.widgetFamily === "large" || config.widgetFamily === "extraLarge"){  
    let txtStack = w.addStack()
    txtStack.layoutVertically()
    let title = txtStack.addText("Latest earthquake in Italy")
    title.font = Font.regularRoundedSystemFont(12)
    txtStack.addSpacer(5)
    let region = txtStack.addText(`${event.region.split(" [")[0]} - ${event.mag} Mg`)
    region.font = Font.boldRoundedSystemFont(17)
    region.textColor = new Color(colors[event.color])
    w.addSpacer(10)
    let image = w.addImage(img)
    image.cornerRadius = 5
    image.centerAlignImage()
    w.addSpacer(5)
    let footerStack = w.addStack()
    let date = footerStack.addText(`${event.time.split("T")[0].split("-").reverse()}`.replace(",", "/").replace(",", "/"))
    date.font = Font.mediumRoundedSystemFont(12)
    footerStack.addSpacer();
    let symbol = footerStack.addImage(SFSymbol.named("waveform.path.ecg").image)
    symbol.tintColor = Color.dynamic(Color.black(), Color.white())
    symbol.imageSize = new Size(17, 17)        
   }else{
    let wStack = w.addStack()
     wStack.layoutHorizontally()
  
     let txtStack = wStack.addStack();
     txtStack.layoutVertically()
     txtStack.addSpacer()
  
     //let title = txtStack.addText("Latest earthquake in Italy")
     //title.font = Font.regularRoundedSystemFont(12)

     txtStack.addSpacer(5)
   
     let region = txtStack.addText(`${event.region.split(" [")[0]} - ${event.mag} Mg`)
     region.font = Font.boldRoundedSystemFont(15)
     region.textColor = new Color(colors[event.color])
   
     txtStack.addSpacer(10)
   
     let footerStack = txtStack.addStack()
     let date = footerStack.addText(`${event.time.split("T")[0].split("-").reverse()}`.replace(",", "/").replace(",", "/"))
     date.font = Font.mediumRoundedSystemFont(12)
     footerStack.addSpacer();
  
   if(config.widgetFamily === 'small'){ 
     let symbol = footerStack.addImage(SFSymbol.named("waveform.path.ecg").image)
     symbol.tintColor = Color.dynamic(Color.black(), Color.white())
     symbol.imageSize = new Size(17, 17)
   }
   if(config.widgetFamily === "medium"){
     //title.font = Font.regularRoundedSystemFont(15)
     region.font = Font.boldRoundedSystemFont(16)
   }else if(config.widgetFamily === 'large' || config.widgetFamily === 'extraLarge'){
     region.font = Font.boldRoundedSystemFont(21)
   }
    
   wStack.addSpacer()
   
  
   if(config.widgetFamily !== 'small'){
     let image, imgStack;
     if(config.widgetFamily === "large" || config.widgetFamily === "extraLarge"){
       imgStack = w.addStack()
      }else{
      	imgStack = wStack.addStack()
      }
      imgStack.layoutVertically()
      imgStack.addSpacer()
      image = imgStack.addImage(img)
      image.cornerRadius = 5
      imgStack.addSpacer()
  }   
  txtStack.addSpacer()
  }
  return w
}

async function retrieveImage(lat, long, color){
  let map;
  if(Device.isUsingDarkAppearance()){
    map = 'dark-v10'
  }else{
    map = 'streets-v11'
  }
  let url = `https://api.mapbox.com/styles/v1/mapbox/${map}/static/pin-s+${color.split('#')[1]}(${long},${lat})/${long},${lat},5.6,0/400x300@2x?access_token=${key}`;
  var request = await new Request(url)
  var response = await request.loadImage()
  return response
}
 
const event = await getEarthquakes()
const img = await retrieveImage(event.lat, event.long, colors[event.color])

log(event.long)
let widget = await createWidget(event, img)
if(config.runsInWidget){
   Script.setWidget(widget)
   Script.complete()
}

widget.presentMedium()

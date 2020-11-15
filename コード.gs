function main() {
  let sleeping_hours = 7;
  let prepare_hours = 2;
  let sleep_hours = sleeping_hours + prepare_hours;

  var now_date = new Date();
  var now_date_ten = new Date(+now_date + (10 * 60 * 1000));
  
  var events = getGoogleCalendar();
  
  if(events.length!=0){
    var tommorow_event = events[0];
    judgmentPush(tommorow_event);

  }
}
  
function getGoogleCalendar(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty('calendar_id');//プロパティで設定  
  var date = new Date();
  date.setDate(date.getDate() + 1); //明日の日付
  
  var calendar = CalendarApp.getCalendarById(calendar_id);
  var events = calendar.getEventsForDay(date); //イベントの取得
  
  return events;
}

function judgmentPush(event){
  var start_time = event.getStartTime();//一番最初の予定を取得
  var event_time = event.getEndTime();
  var event_title = event.getTitle();//イベントタイトル
  
  start_time.setHours(start_time.getHours()-sleep_hours);//時間の計算
  var sleep_time = start_time.toLocaleString(); //寝る時間の指定
      
  if (sleep_time <= now_date && sleep_time >= now_date_ten) {
   pushSlack(event_title +" >> "+ start_time + "〜");
  }
}

function pushSlack(add_message){
  const postUrl = PropertiesService.getScriptProperties().getProperty('slack_webhook_id');
  var username = 'sleep-alert-bot';
  var icon = ':sleeping:';
  var message = 'そろそろ寝る時間です！明日のイベント:'+ add_message;
  
  var jsonData =
      {
        "username" : username,
        "icon_emoji": icon,
        "text" : message
      };
  
  var payload = JSON.stringify(jsonData);

  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch(postUrl, options);
}
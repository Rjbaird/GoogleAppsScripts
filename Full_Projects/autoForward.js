/*
========== SETUP INSTRUCTIONS: ==========

Copy and paste the text below into a new Google App Script under the Gmail account you want to monitor.
Save the script.
Run both functions as is and authorize each script to run.
Replace each email address in the allLeads list with the leads to watch for. Current max is 4 leads.
Replace each email address in the forwardsList with each contact you want to forward to. No max just make sure to keep the addresses in the "quotes"

Once both functions are authorized and updated, click on the Triggers button (between the save and run buttons)

Add a new time-based Trigger for the timeTrigger function that runs every minute.


========== EXPLANATIONS: ==========

timeTrigger:
The timeTrigger function check the current time and only runs the tagLeads function if the conditions are met. 

Currently, it only runs from Monday - Friday between the hours of 12am to 7:30am and again from 8pm to 11:59am. 

tagLeads:
The tagLeads function below checks the last 5 message threads in an inbox. 

If the sender of an email is from the allLeads list AND there are no other messages in the thread, forward the email to all emails in the forward list with the body saying "Mine". 

Repeat for each email.

*/

function timeTrigger() {
  var today = new Date(); // get all current time information
  var hour = today.getHours(); // get the current hour
  var minute = today.getMinutes(); // get current minutes
  if (today != 0 || today != 6) { // if it is a weekend
    if (hour >= 20) { // verify that it is after 8pm
      tagLeads();
    } else if (hour <= 7 && minute <= 30) { // verify that it is before 7:30am
      tagLeads();
    }
  }
}


const allLeads = ["email1@email.com", "email2@email.com", "email3@email.com", "email4@email.com"] // enter email address for each lead inbetween their own "quotes"
const forwardsList = "forwardsEmail1@email.com, forwardsEmail1@email.com, forwardsEmail1@email.com" // enter information for each forward address inbetween the "surrounding quotes"

function tagLeads() { 
  var inbox = GmailApp.getInboxThreads(0, 5); // Get the 5 most recent message threads from Inbox
  // Look at each thread of the last 5 messages in the inbox
  for (let i = 0; i < inbox.length; i++) {
    let leadInfo = inbox[i]; // set up variable for each message thread
    let length = leadInfo.getMessageCount(); // gets thread length so we only reply/forward from the last message recieved in the thread
    let message = leadInfo.getMessages()[0]
    let from = message.getFrom(); // info on who sent the message
    let date = message.getDate(); // info on message date
    let subject = message.getSubject(); // info on message subject
    let to = message.getTo(); // message "to" information
    let body = message.getBody(); // info on message body
    if (length == 1 && from.includes(allLeads[0]) || from.includes(allLeads[1]) || from.includes(allLeads[2]) || from.includes(allLeads[3])) 
    { // verify that the message has not been replied to and was sent from a lead
      message.forward(forwardsList, {
        subject: subject,
        htmlBody: "Mine" + "<br>" +
        "---------- Forwarded message ---------" + "<br>" + 
        "From: " + from + "<br>" +
        "Date: " + date +
        "Subject: " + subject + "<br>" +
        "To: " +  to + "<br>" +
        body
      });
    }
  }
}
class Rover {
  constructor(position) {
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = 110
  }
  // Input a message
  receiveMessage(message) {
    let receivedMessage = {};
    let commandArr = [];
    for (let i = 0; i < message.commands.length; i++) {
      if (message.commands[i].commandType == 'MOVE') {
        if (this.mode == 'NORMAL') {
          commandArr.push(
            {
              completed: true,
              position: message.commands[i].value
            }
          );
        } else {
          commandArr.push(
            { completed: false }
          );
        }
      } else if (message.commands[i].commandType == 'STATUS_CHECK') {
        commandArr.push(
          {
            completed: true,
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
          }
        );
      } else if (message.commands[i].commandType == 'MODE_CHANGE' && message.commands[i].value == 'LOW_POWER') {
        commandArr.push(
          {
            completed: true,
            mode: 'LOW_POWER'
          }
        );
        this.mode = 'LOW_POWER'
      } else if (message.commands[i].commandType == 'MODE_CHANGE') {
        commandArr.push(
          { completed: true }
        );
      }
    }
    receivedMessage.name = message.name;
    receivedMessage.commands = commandArr;
    return receivedMessage;
  };

}




module.exports = Rover;
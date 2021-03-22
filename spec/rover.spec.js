const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() {
  it("constructor sets position and default values for mode and generatorWatts", function() {
    let defaultRover = new Rover();
    expect(defaultRover.mode).toEqual('NORMAL');
    expect(defaultRover.generatorWatts).toEqual(110);
  });
  it("response returned by receiveMessage contains name of message", function() {
    let sendMessage = new Message("testName", "testCommand");
    let rover = new Rover();
    let receivedMessage = rover.receiveMessage(sendMessage);
    expect(receivedMessage.name).toEqual('testName')
  });
  it("response returned by receiveMessage includes two results, if two commands are sent in message", function() {
    let rover = new Rover();
    let sendMessage = new Message("testName", [new Command('MOVE', 1), new Command('MODE_CHANGE')]);
    let receivedMessage = rover.receiveMessage(sendMessage);
    expect(receivedMessage.commands.length).toEqual(2);
  });
  it("responds correctly to status check", function() {
    let testCommands = [new Command('STATUS_CHECK')];
    let testMessage = new Message("Checking status", testCommands);
    let roverCheck = new Rover(1);
    let response = roverCheck.receiveMessage(testMessage);
    expect(response.commands[0].completed).toEqual(true);
    expect(response.commands[0].generatorWatts).toEqual(110);
    expect(response.commands[0].mode).toEqual('NORMAL');
    expect(response.commands[0].position).toEqual(1);
  });
  it("responds with correct status after MODE_CHANGE", function() {
    let testModeCommand = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let testModeMessage = new Message("Change the mode", testModeCommand);
    let roverMode = new Rover(1)
    let responding = roverMode.receiveMessage(testModeMessage);
    expect(responding.commands[0].mode).toEqual('LOW_POWER');
  });
  it("responds with false completed value, if attempt to move while in LOW_POWER mode", function() {
    let rover = new Rover(1);
    let testModeCommand = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let testModeMessage = new Message("Change the mode", testModeCommand);
    let newRover = rover.receiveMessage(testModeMessage);
    let moveRover = [new Command('MOVE', 1333)];
    let testMoveMessage = new Message("Move the rover", moveRover);
    let responding = rover.receiveMessage(testMoveMessage);
    expect(responding.commands[0].completed).toEqual(false);
  });
  it("resonds with position for move command", function() {
    let rover = new Rover(1);
    let moveCommand = [new Command('MOVE', 1333)];
    let positionResponse = new Message("move rover over there", moveCommand);
    let responding = rover.receiveMessage(positionResponse);
    expect(responding.commands[0].position).toEqual(1333);
  });

// Fixed TA Commands Passes  ⬇️

// it("Responds to TA message & commands", function() {
//     let rover = new Rover(100);
//     let commands = [
//       new Command('MOVE', 4321),
//       new Command('STATUS_CHECK'),
//       new Command('MODE_CHANGE', 'LOW_POWER'),
//       new Command('MOVE', 3579),
//       new Command('STATUS_CHECK')
//     ];
//     let message = new Message('TA power', commands);
//     let response = rover.receiveMessage(message);
//     expect(response.name).toEqual('TA power');
//     expect(response.commands[0].completed).toBeTrue;
//     expect(response.commands[0].position).toEqual(4321);
//     expect(response.commands[2].completed).toBeTrue;
//     expect(response.commands[3].completed).toBeFalse;
//     expect(response.commands[0].position).toEqual(4321);
//     expect(response.commands[4].mode).toEqual('LOW_POWER');
//     expect(response.commands[4].generatorWatts).toEqual(110);
//   });


});

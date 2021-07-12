const { response } = require("express");
const models = require("../models");

const tableEvents = models.Events;

exports.create_events = async (executed_where, event, id) => {
  if (typeof id === "string") {
    const myUserId = parseInt(id.split("-")[0]);
    const chatId = parseInt(id.split("-")[1]);
    if (id.split("-").length === 2) {
      const responseEvent = await tableEvents.create({
        chatId,
        userId: myUserId,
        event: `${executed_where} => ${event}`,
      });
      return responseEvent;
    }

    const messageId = parseInt(id.split("-")[2]);
    const responseEvent = await tableEvents.create({
      chatId,
      userId: myUserId,
      messageId,
      event: `${executed_where} => ${event}`,
    });

    const newMessage = await tableEvents.findOne({
      where: { id: responseEvent.id },
      include: ["eventsInMessage"],
    });
    return newMessage;
  }

  if (executed_where == "Chat") {
    await tableEvents.create({
      chatId: id,
      event: `${executed_where} => ${event}`,
    });
    return;
  }

  await tableEvents.create({
    userId: id,
    event: `${executed_where} => ${event}`,
  });
  return;
};

import { TransferEvent, Message, Delegation, UnDelegation, ReDelegation, ClaimReward } from "../types";
import {
  CosmosEvent,
  CosmosBlock,
  CosmosMessage,
  CosmosTransaction,
} from "@subql/types-cosmos";

/*
export async function handleBlock(block: CosmosBlock): Promise<void> {
  // If you want to index each block in Cosmos (CosmosHub), you could do that here
}
*/

/*
export async function handleTransaction(tx: CosmosTransaction): Promise<void> {
  // If you want to index each transaction in Cosmos (CosmosHub), you could do that here
  const transactionRecord = Transaction.create({
    id: tx.hash,
    blockHeight: BigInt(tx.block.block.header.height),
    timestamp: tx.block.block.header.time,
  });
  await transactionRecord.save();
}
*/

export async function handleMessage(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    from: msg.msg.decodedMsg.fromAddress,
    to: msg.msg.decodedMsg.toAddress,
    amount: JSON.stringify(msg.msg.decodedMsg.amount),
  });
  await messageRecord.save();
}

export async function handleEvent(event: CosmosEvent): Promise<void> {
  const eventRecord = new TransferEvent(
    `${event.tx.hash}-${event.msg.idx}-${event.idx}`
  );
  eventRecord.blockHeight = BigInt(event.block.block.header.height);
  eventRecord.txHash = event.tx.hash;
  for (const attr of event.event.attributes) {
    switch (attr.key) {
      case "recipient":
        eventRecord.recipient = attr.value;
        break;
      case "amount":
        eventRecord.amount = attr.value;
        break;
      case "sender":
        eventRecord.sender = attr.value;
        break;
      default:
        break;
    }
  }
  await eventRecord.save();
}

export async function handleDelegation(msg: CosmosMessage): Promise<void> {
  const delegationRecord = Delegation.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    delegatorAddress: msg.msg.decodedMsg.delegatorAddress,
    validatorAddress: msg.msg.decodedMsg.validatorAddress,
    amount: msg.msg.decodedMsg.amount,
  });
  await delegationRecord.save();
}

export async function handleUndelegation(msg: CosmosMessage): Promise<void> {
  const undelegationRecord = UnDelegation.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    delegatorAddress: msg.msg.decodedMsg.delegatorAddress,
    validatorAddress: msg.msg.decodedMsg.validatorAddress,
    amount: msg.msg.decodedMsg.amount,
  });
  await undelegationRecord.save();
}

export async function handleRedelegation(msg: CosmosMessage): Promise<void> {
  const relegationRecord = ReDelegation.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    delegatorAddress: msg.msg.decodedMsg.delegatorAddress,
    srcValidatorAddress: msg.msg.decodedMsg.validatorSrcAddress,
    dstValidatorAddress: msg.msg.decodedMsg.validatorDstAddress,
    amount: msg.msg.decodedMsg.amount,
  });
  await relegationRecord.save();
}

export async function handleClaimReward(msg: CosmosMessage): Promise<void> {
  const claimRewardRecord = ClaimReward.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    delegatorAddress: msg.msg.decodedMsg.delegatorAddress,
    validatorAddress: msg.msg.decodedMsg.validatorAddress,
    amount: msg.msg.decodedMsg.amount != null ? msg.msg.decodedMsg.amount : "",
  });
  await claimRewardRecord.save();
}
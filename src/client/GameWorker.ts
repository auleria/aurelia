import { GameWorld } from "./game/GameWorld";
import { DebugWorld } from "./game/worlds/DebugWorld";
import { Remote } from "./Remote";
import { ByteBuffer } from "./ByteBuffer";
import { NetworkCode } from "./NetworkCode";

export class GameWorker
{
	private world : GameWorld;
	private buffer : ByteBuffer;

	constructor()
	{
		this.buffer = new ByteBuffer();
		this.createWorld();
		setInterval(() => this.tick(), 1000 / 20);
	}

	private tick()
	{
		this.world.setBuffer(this.buffer);
		this.world.tick();
		this.world.writeToBuffer();

		this.sendMessage();
	}

	private sendMessage()
	{
		let trimmed = this.buffer.getTrimmedBuffer();
		postMessage({data : trimmed}, [trimmed] as any);
		this.buffer = new ByteBuffer();
	}

	private createWorld()
	{
		this.world = new DebugWorld(true);
		this.world.initialize();
		this.buffer.writeByte(NetworkCode.CREATE_WORLD);
		this.buffer.writeString(this.world.constructor.name);
		this.buffer.writeId(this.world.id);
	}
}

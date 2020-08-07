import NamedEntity from "models/NamedEntity";
import AssisstantResponse from "models/AssisstantResponse";

abstract class CommandExecuter<CommandParams> {
    abstract extractParamsFromEntities: (entities: NamedEntity[]) => CommandParams;
    abstract processCommand: (params: CommandParams) => Promise<AssisstantResponse>;
}

export default CommandExecuter;
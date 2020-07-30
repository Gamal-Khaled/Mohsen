import NamedEntity from "models/NamedEntity";

abstract class CommandExecuter<CommandParams> {
    abstract extractParamsFromEntities: (entities: NamedEntity[]) => CommandParams;
    abstract executeCommand: (params: CommandParams) => void;
}

export default CommandExecuter;
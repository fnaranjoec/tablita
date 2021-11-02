import * as sequelize from "sequelize";


const getWhere = ({filter, status}) => {

    var finalWhere = {};

    var operatorPosition;
    var operatorField;
    var operatorName;

    var key;
    var value;

    // Defino los operadores permitidos // **** AGREGAR AQUI CUANDO HAYA NUEVO OPERADOR
    const operatorsAllowed = [
        "not", "in", "notIn",
        "like", "notLike", "substring", "notSubstring",
        "startsWith", "endsWith",
        "notStartsWith", "notEndsWith",
        "between", "notBetween",
        "greatherThan", "greatherThanOrEqual",
        "lessThan", "lessThanOrEqual", "is"
    ];

    // Itero sobre cada campo del filtro
    for(var attributename in filter){

        // Obtengo Campo y Operador del filtro
        operatorPosition = attributename.lastIndexOf("_");
        operatorField = attributename.substring(0,operatorPosition);
        operatorName = attributename.substring(operatorPosition+1, attributename.length);

        // Sino tiene ningun operador asigo operador EQUAL
        if (!operatorsAllowed.includes(operatorName)) {
            operatorName="equal";
            operatorField=attributename;
        }

        // Defino key y value para el nodo del JSON
        key=`${operatorField}`;
        value=`${operatorName}_${filter[attributename]}`;

        // Creo el nodo del JSON
        finalWhere[key]=value ;

    }


    // console.log('finalWhere', finalWhere);


    // Inicializo el JSON para el WHERE
    let where = {
        [sequelize.Op.and]: {}
    };

    for(var attributename in finalWhere) {

        const valueAttribute =finalWhere[attributename];
        const operator = valueAttribute.substring(0,valueAttribute.indexOf("_", 0));
        const valueOperator = valueAttribute.substring(valueAttribute.indexOf("_", 0)+1, valueAttribute.length);
        var valueOperatorArray=[];

        // Comparo cada operador y creo el nodo del JSON WHERE para cada caso
        switch (operator) {
            case "equal":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.eq]: valueOperator=='null' ? null : valueOperator};
                break;
            case "not":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.ne]: valueOperator};
                break;
            case "in":
                valueOperatorArray = valueOperator.split(",");  // separo los elementos en un array
                where[sequelize.Op.and][attributename] = { [sequelize.Op.in]: valueOperatorArray};
                break;
            case "notIn":
                valueOperatorArray = valueOperator.split(",");  // separo los elementos en un array
                where[sequelize.Op.and][attributename] = { [sequelize.Op.notIn]: valueOperatorArray};
                break;
            case "like":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.like]: valueOperator};
                break;
            case "notLike":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.notLike]: valueOperator};
                break;
            case "substring":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.substring]: valueOperator};
                break;
            case "notSubstring":
                where[sequelize.Op.and][sequelize.Op.not]={}
                where[sequelize.Op.and][sequelize.Op.not][attributename] = { [sequelize.Op.substring]: valueOperator};
                break;
            case "startsWith":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.startsWith]: valueOperator};
                break;
            case "notStartsWith":
                where[sequelize.Op.and][sequelize.Op.not]={}
                where[sequelize.Op.and][sequelize.Op.not][attributename] = { [sequelize.Op.startsWith]: valueOperator};
                break;
            case "endsWith":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.endsWith]: valueOperator};
                break;
            case "notEndsWith":
                where[sequelize.Op.and][sequelize.Op.not]={}
                where[sequelize.Op.and][sequelize.Op.not][attributename] = { [sequelize.Op.endsWith]: valueOperator};
                break;
            case "between":
                valueOperatorArray = valueOperator.split(",");  // separo los elementos en un array
                // valueOperatorArray[0]= new Date(valueOperatorArray[0]);
                // valueOperatorArray[1]= new Date(valueOperatorArray[1]);
                where[sequelize.Op.and][attributename] = { [sequelize.Op.between]: valueOperatorArray};
                break;
            case "notBetween":
                valueOperatorArray = valueOperator.split(",");  // separo los elementos en un array
                where[sequelize.Op.and][attributename] = { [sequelize.Op.notBetween]: valueOperatorArray};
                break;
            case "greatherThan":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.gt]: valueOperator};
                break;
            case "greatherThanOrEqual":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.gte]: valueOperator};
                break;
            case "lessThan":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.lt]: valueOperator};
                break;
            case "lessThanOrEqual":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.lte]: valueOperator};
                break;
            case "is":
                where[sequelize.Op.and][attributename] = { [sequelize.Op.is]: valueOperator=='null' ? null : valueOperator};
                break;
            default:
                break;

        }


    }

    // // FILTRO FINAL DEL ESTADO PARA NO MOSTRAR LOS ELIMINADOS
    // const theStatus = `${status}`;

    if (status!==null) {

        // Si NO HAY un status agrego este filtro predeterminado para status
        if (!JSON.stringify(where[sequelize.Op.and]).includes(status)){
            where[sequelize.Op.and][status]= {[sequelize.Op.ne] : ["X"]};
        }

    }

    return where;

};


export default getWhere;
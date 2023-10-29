/* Sample Data */
let js = [
    {"id": 0, "value": 0},
    {"id": 1, "value": 20},
    {"id": 2, "value": 80},
    {"id": 3, "value": 0},
    {"id": 4, "value": 70},
    {"id": 5, "value": 75},
    {"id": 6, "value": 20},
    {"id": 7, "value": 80},
    {"id": 8, "value": 100},
    {"id": 9, "value": 70}, 
]

/* Sample Data Store Class */
class DataStore {
    constructor(data) {
        this._data = data;
    }

    // getter
    get data() {
        return this._data;
    }

    // setter
    set data(newValue) {
        this._data = newValue;
    }
}

/** Create the sampleData Object */
const sampleData = new DataStore(js);


/* Basic Setting function */
/** Draw the graph based on data*/
const graph_draw = (data) => {
    // Initialize to empty innerHTML
    document.querySelector('.graph_side').innerHTML = "";
    document.getElementById("graph").innerHTML = "";
    document.getElementById("labels").innerHTML = "";

    let values = []; // Store Value
    let labels = []; // Store id
    
    data.forEach(function (item) {
        values.push(item.value);
        labels.push(item.id);
    });

    /* .graph_side create */
    let max_value = Math.max(...values) //Extract the Max value in values
    let html =  '<h4 id="max">' + max_value + '</h4>' + '<h4 id="mid">' + max_value / 2 + '</h4>'; 
    if (max_value <= 0) {
        max_value = 100 
        html = '<h4 id="max">' + 0 + '</h4>';
    }
    let element = document.querySelector('.graph_side');
    element.innerHTML += html;

    /* #graph #labels create */
    values.forEach(function (value, index) {
        // #graph
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = ((value/max_value) * 100) + "%";
        document.getElementById("graph").appendChild(bar);

        // #labels
        let label = document.createElement("div");
        label.className = "label";
        label.textContent = labels[index];
        document.getElementById("labels").appendChild(label);
    });

    let bar_end = document.createElement("div");
    bar_end.className = "bar";
    bar_end.style.height = "100%";
    bar_end.style.backgroundColor = "white";
    document.getElementById("graph").appendChild(bar_end);
}

/** draw the table based on data */
const data_delete = (data) => {
    document.getElementById("jsonTable").innerHTML = "";

    let table = document.getElementById('jsonTable');
    let th = document.createElement('tr');
    let count = 0;
    th.innerHTML = "<th>ID</th><th>값</th>"
    table.appendChild(th);

    data.forEach(function (object) {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td id="object_id">' + object.id + '</td>'
            + '<td id="object_value"><input id="table_value'+count+'" value='+object.value+'>'  + '</input></td>'
            + '<td>' + '<button id="btn" onclick="clickHandleDelete(this)">삭제</button>' + '</td>';
        table.appendChild(tr);
        count += 1;
    });
}

/** draw the JSON editor textfield */
const data_modify = (data) => {
    let cleanedData = data.filter(item => item !== null);
    document.getElementById("jsonOutput").value = JSON.stringify(cleanedData, 10, 2);
}

/* Graph Calculation */
/** calculate the sum of values inside data */
const plus_value = (data) => {
    let sum_value = 0;

    data.forEach(function (object) {
        let value = object.value
        sum_value = sum_value + value;
    });

    return sum_value
}


/* Click Handle Function */
/** 
 * trigger when the Delete button clicked. 
 * delete the object match with id
 * reinitialize the component based on new data
 */
const clickHandleDelete = (button) => {
    const object_id = button.parentNode.parentNode.querySelector('#object_id').textContent;
    let oldData = sampleData.data
    let newData = [];

    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].id !== parseInt(object_id)) {
        newData.push(oldData[i]);
        }
    }

    sampleData.data = newData;
    initial_page()
}

/**
 * edit the value in table
 * check if the value is valid (NaN or less than 0)
 */
const clickHandleTableEdit = () => {
    try {
        let oldData = JSON.parse(JSON.stringify(sampleData.data));
        for (let i = 0; i < oldData.length; i++) {
            table_id = oldData[i].id;
            table_value = document.getElementById('table_value' + i).value;
            if (Number.isNaN(parseFloat(table_value))) throw new Error('숫자를 입력해 주세요.');
            else if (parseFloat(table_value) < 0) throw new Error('0보다 큰 값을 입력해 주세요');
            else if (!/^\d+(\.\d+)?$/.test(table_value.toString())) throw new Error('입력값에 문자가 포함되어 있습니다');
            oldData[i].value = parseFloat(document.getElementById('table_value' + i).value);
        }
        console.log('edit')
        sampleData.data = oldData;
        initial_page()
    } catch(e) {
        alert(e.message);
        initial_page();
    }
    
}

/**
 * trigger when the Add button clicked
 * add the inserted id and value data
 * reinitialize the components
 */
const clickHandleAdd = () => {
    try {
        let id = document.getElementById("id_num").value;
        let value = document.getElementById("value_num").value
        let oldData = JSON.parse(JSON.stringify(sampleData.data));
        // let newData_result = id_value_Check(id,value)
        if (id_value_Check(id,value)) {
            oldData.push({
            "id": parseFloat(id),
            "value":parseFloat(value)
            })
        
            //check if the id is unique
            if (Json_form_Check(JSON.stringify(oldData))) sampleData.data = oldData;   
        }
        initial_page()
    } catch (e) {
        alert(e.message);
        
    }
    
}

/**
 * Handle textfield editor
 * check if the value parse to JSON
 */
const clickHandleEdit = () => {
    try {
        let jsonObject = document.getElementById("jsonOutput").value;
        let newData = JSON.parse(jsonObject); //If the format could be change to JSON
        let result = Json_form_Check(jsonObject)
        if (result) sampleData.data = newData;
        initial_page()
    } catch (e) {
        alert("JSON 형식에 맞지 않습니다");
        initial_page()
    }
}

/* Error Handling */
/**
 * check if the id is unique
 * check if all the object contain id and value
 */
const Json_form_Check = (str_data) => {
    try {
        data = JSON.parse(str_data);
        // data=str_data
        let idSet = new Set();
        let allObjectsHaveIdAndValue = true;
        let allIdsAreUnique = true;

        for (let obj of data) {
            if (!obj.hasOwnProperty('id') || !obj.hasOwnProperty('value')) {
                allObjectsHaveIdAndValue = false;
                throw new Error('id와 value 값은 필수로 들어가야 합니다');
            }

            if (idSet.has(obj.id)) {
                allIdsAreUnique = false;
                throw new Error('id는 중복될 수 없습니다.');
            }
            if(!id_value_Check(obj.id,obj.value)) return false
            idSet.add(obj.id);
        }
        return true
    } catch (e) {
        alert(e.message);
        return false
    }
}

/**
 * check if id or value is NaN
 * check if id is not float 
 * check if value is under 0
 */
const id_value_Check = (new_id, new_value) => {
    try {
        let id = parseFloat(new_id);
        let value = parseFloat(new_value);
        
        // console.log(/^\d+(\.\d+)?$/.test(value.toString()))
        //check id id and value is not integer
        if (Number.isNaN(id) || Number.isNaN(value)) throw new Error('숫자를 입력해 주세요');
        else if (!Number.isInteger(id)) throw new Error('id는 정수로 입력해 주세요');
        else if (parseInt(value) < 0) throw new Error('0보다 큰 값을 입력해 주세요');
        else if (!/^\d+(\.\d+)?$/.test(new_id.toString()) || !/^\d+(\.\d+)?$/.test(new_value.toString())) throw new Error('입력값에 문자가 포함되어 있습니다.');
        
        return true
    } catch (e) {
        alert(e.message);
        return false
    }
}

//Initialize
const initial_page = () => {
    graph_draw(sampleData.data);
    data_delete(sampleData.data);
    data_modify(sampleData.data);
}

/* First Page Render Setting */
initial_page() //initialize the components at first render

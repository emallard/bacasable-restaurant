
function get(url, callback)
{
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4 && req.status == 200) {
            callback(req);
        }
    };
    req.send();
}

function post(url, data, callback)
{
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.responseType = "application/json";
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) { 
                if(callback) callback(req);
            }
            else {
                alert('Erreur pendant ' + url + '.\n');
            }
        }
    };
    req.send(JSON.stringify(data));
}

function addOption(id, text, value)
{
    var x = document.getElementById(id);
    var option = document.createElement("option");
    option.text = text;
    option.value = value;
    x.add(option);
}

function selectedOptionValue(id)
{
    var x = document.getElementById(id);
    return x.options[x.selectedIndex].value;
}





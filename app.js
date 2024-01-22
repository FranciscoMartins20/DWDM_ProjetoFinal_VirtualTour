const {i18next} = require('./config-lang.js');
const path = require('path');
var apppath = require("electron").remote.app.getAppPath();

var wtmdata = {
    projects: []
};

if (localStorage.getItem("wtmdata") === null) {
    saveWtmdata();
} else {
    loadWtmdata();
}

function saveWtmdata() {
    localStorage.setItem("wtmdata", JSON.stringify(wtmdata));
}

function loadWtmdata() {
    wtmdata = JSON.parse(localStorage.getItem("wtmdata"));
}

function reloadApp() {
    location.reload();
}


let predefinedDir = "";
let predefinedDirExport = "";

// Caminho para a pasta de instalação
const appPath = path.join(require('electron').remote.app.getPath('exe'), '..');

// Caminho para o arquivo de configuração
const configPath = path.join(appPath, 'data', 'config', 'config.json');
// const configPath = 'config.json'; // para npm start
const defaultConfig = {
    company: "MITMYNID",
    appname: "Virtual Tour",
    darkmode: "no",
    language: "PT_PT",
    projectpath: "",
    projectpathexport: "",
    server_url: "https://...",
    server_user: "tony",
    server_pass: "xxx",
    server_key: "jiofgehwa349"
};

let config;

// Diretório predefinido

// Obter o caminho absoluto da pasta de instalação e atualizar o projectpath
defaultConfig.projectpath = path.join(appPath, 'data', 'projects');
defaultConfig.projectpathexport = path.join(appPath, 'data', 'exports');

function loadConfig() {
    try {
        const configData = fs.readFileSync(configPath);
        const parsedConfig = JSON.parse(configData);
        config = Object.assign({}, defaultConfig, parsedConfig);
        predefinedDir = config.projectpath; // atualiza predefinedDir com o valor lido no arquivo de configuração
        predefinedDirExport = config.projectpathexport;
        updateInterface(); // atualiza a interface após definir predefinedDir
    } catch (err) {
        console.error(err);
    }
}
// Função para ler o arquivo de configuração e atualizar a interface
function updateInterface() {
    try {
        const configData = fs.readFileSync(configPath);
        const parsedConfig = JSON.parse(configData);
        config = Object.assign({}, defaultConfig, parsedConfig);
        predefinedDir = config.projectpath;
        predefinedDirExport = config.projectpathexport || '';
        document.getElementById('projectpath').value = config.projectpath || '';
        document.getElementById('darkmode').value = config.darkmode || '';
        document.getElementById('language').value = config.language || '';
        document.getElementById('projectpathexport').value = config.projectpathexport || '';

        // Atualize o estilo com base na configuração de darkmode
        const styleSheet = document.getElementById('style-sheet');
        if (config.darkmode === 'yes') {
            styleSheet.href = 'style.css';
        } else if (config.darkmode === 'mitmynid') {
            styleSheet.href = 'style-MITMYNID.css';
        } else {
            styleSheet.href = 'style-light.css';
        }
    } catch (err) {
        console.error(err);
    }
}


// Verificar se o arquivo de configuração existe
// colocar isto numa função
if (fs.existsSync(configPath)) {
    try {
        config = JSON.parse(fs.readFileSync(configPath));
        loadConfig(); // chama a função loadConfig() para atualizar a variável predefinedDir e a interface
        updateInterface(); // atualiza a interface após definir predefinedDir
    } catch (err) {
        console.error(err);
        config = defaultConfig;
    }
} else {
    config = defaultConfig;
    loadConfig();
    updateInterface(); // atualiza a interface após definir predefinedDir
}

const configDir = path.join(appPath, 'data', 'config');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
}

// Carrega a configuração existente ou usa a configuração padrão
if (fs.existsSync(configPath)) {
    try {
        config = JSON.parse(fs.readFileSync(configPath));
        loadConfig();
        updateInterface();
    } catch (err) {
        console.error(err);
        config = defaultConfig;
    }
} else {
    config = defaultConfig;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    reloadApp();
}

function updateConfig() {
    const projectpath = document.getElementById('projectpath').value;
    const projectpathexport = document.getElementById('projectpathexport').value;
    const darkmode = document.getElementById('darkmode').value;
    const language = document.getElementById('language').value;

    // Atualizar apenas as chaves necessárias
    const newConfig = {};
    if (projectpath) 
        newConfig.projectpath = projectpath;
    

    if (projectpathexport) {
        newConfig.projectpathexport = projectpathexport;
    }
    if (darkmode) 
        newConfig.darkmode = darkmode;
    

    if (language) 
        newConfig.language = language;
    

    try {
        const existingConfig = JSON.parse(fs.readFileSync(configPath));
        config = Object.assign({}, defaultConfig, existingConfig, newConfig);
        predefinedDir = config.projectpath; // Adicionar esta linha para atualizar predefinedDir
        predefinedDirExport = projectpathexport;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        document.getElementById('status').textContent = i18next.t('update_success');
        updateInterface();
        // atualiza a interface após atualizar o arquivo de configuração

        // Recarrega a aplicação após atualizar o arquivo de configuração
        reloadApp();
    } catch (err) {
        console.error(err);
        document.getElementById('status').textContent = i18next.t('update_error');
    }
}


function selectPath() {
    const {dialog} = require('electron').remote;

    const options = {
        title: i18next.t('select_project_path'),
        properties: ['openDirectory']
    };


    dialog.showOpenDialog(options).then(result => {
        if (result.canceled) {
            console.log('Explorador de arquivos fechado sem seleção');
            return;
        }

        // Atualiza o valor do elemento "projectpath" com o caminho selecionado
        const projectPath = result.filePaths[0];
        document.getElementById('projectpath').value = projectPath;

        // Atualiza a variável predefinedDir com o caminho selecionado
        predefinedDir = projectPath;

    }).catch(err => {
        console.log(err);
    });
}

function selectExportPath() {
    const {dialog} = require('electron').remote;

    const options = {
        title: i18next.t('select_project_export_path'),
        properties: ['openDirectory']
    };

    dialog.showOpenDialog(options).then(result => {
        if (result.canceled) {
            console.log('Explorador de arquivos fechado sem seleção');
            return;
        }

        const projectexportpath = result.filePaths[0];
        document.getElementById('projectpathexport').value = projectexportpath;
        predefinedDirExport = projectexportpath;
    }).catch(err => {
        console.log(err);
    });
    console.log("Valor atual de predefinedDirExport: ", predefinedDirExport);
}


function updateProjectNameInput() {
    // não é mais necessário
    // var projectNameChoice = $("#projectNameChoice").val();
    var newprojectnameInput = $("#newprojectname");

    // não é mais necessário
    // if (projectNameChoice === "CParaiso") {
    // $("#newprojectname").val("CParaiso").prop("readonly", true);
    // newprojectnameInput.hide();
    // } else {
    // $("#newprojectname").val("").prop("readonly", false).show().focus();
    // newprojectnameInput.show();
    // }
}

// function chooseprojectdir() { // Posso escolher o diretorio
// newprojectname = $("#newprojectname").val();
// if (newprojectname != "") {
//     dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
//       newprojectdir = result.filePaths[0];
//       if (newprojectdir != undefined) {
//         $("#newprojectdir").html(newprojectdir);
//       } else {
//         $("#newprojectdir").html("");
//         newprojectdir = "";
//       }
//     });
// } else {
//     showAlert("Informação Incompleta", "Insira o nome do projeto e especifique depois o diretorio.");
//     $("#newprojectname").focus();
// }
// }

// function predefinedprojectdir() {

// newprojectname = $("#newprojectname").val();
// if (newprojectname != "") {
//     newprojectdir = "C:\Users\Francisco\Desktop\CParaiso\src\web\public\visitas\Tours"; // substitua este caminho pelo seu diretório predefinido
//     $("#newprojectdir").html(newprojectdir);
// }
// }

function openproject() {
    var openedprojectdir = "";
    dialog.showOpenDialog({properties: ["openDirectory"]}).then((result) => {
        openedprojectdir = result.filePaths[0];
        if (openedprojectdir != undefined) {
            // showAlert("Open Project", "Is this correct: " + openedprojectdir + " ?");
            // Try to get the WTMProject.wtm file
            if (fs.existsSync(openedprojectdir + "\\WTMProject.wtm")) {
                fs.readFile(openedprojectdir + "\\WTMProject.wtm", "utf8", function (err, data) {
                    if (err) {
                        showAlert(i18next.t('open_visit'), i18next.t('open_visit_invalid'));
                        return console.log(err);
                    }
                    var openedprojecttitle = JSON.parse(data).title;
                    openedprojectdir = openedprojectdir.replace(/\\/g, "/");

                    if (isProjectExist(openedprojecttitle, openedprojectdir)) {
                        showAlert(i18next.t('open_visit'), i18next.t('open_visit_exist'));
                    } else { // showAlert("Open Project", "Project has been successfully added to Recent Projects list.");
                        wtmdata.projects.push({projectdir: openedprojectdir, projectname: openedprojecttitle});
                        saveWtmdata();
                        loadRecentProjects();
                    }
                });
            } else {
                showAlert(i18next.t('open_visit'), i18next.t('open_visit_invalid'));
            }
        }
    });
}
const {v4: uuidv4} = require("uuid");
const uuid = require("uuid");

function createCustomUUID() {
    const today = new Date();
    const year = today.getFullYear().toString().substr(0, 4);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const randomUUID = uuid.v4().substr(0, 8);
    return year + month + day + "_" + randomUUID;
}

function isProjectTitleExist(title) {
    for (var i = 0; i < wtmdata.projects.length; i++) {
        if (wtmdata.projects[i].projectname == title) 
            return true;
        


    }
    return false;
}

function createproject() {
    const fs = require("fs");
    const currentDate = new Date().toISOString().replace(/-/g, "").substr(0, 8);
    let newprojectname = $("#newprojectname").val().trim();

    const customID = createCustomUUID();
    let newprojectdir = predefinedDir + "/" + customID; // adiciona o nome do projeto ao caminho do diretório
    const username = "Utilizador";

    if (newprojectname == "") {
        newprojectname = username + " " + customID; // use o mesmo identificador para nomear o projeto
    } else if (isProjectTitleExist(newprojectname)) {
        showAlert(i18next.t('invalid_name'), i18next.t('visit_already_exists'));
        return;
    }

    showDim(i18next.t('loading_message'));

    setTimeout(function () { // cria a nova pasta do projeto
        fs.mkdirSync(newprojectdir);

        // inicializa os dados do projeto
        var initialProjectData = {
            title: newprojectname,
            author: username,
            panoramas: [],
            settings: {
                description: i18next.t('new_visit_title'),
                loadingtext: i18next.t('loading_text')
            }
        };
        currentprojectdata = initialProjectData;
        // escreve o arquivo do projeto
        fs.writeFile(newprojectdir + "/WTMProject" + projectext, JSON.stringify(initialProjectData), function (err) {
            if (err) 
                return console.log(err);
            


            console.log("Tadaaaa! New project is created!");

            const srcDir = __dirname + "/resources/panotemplate";
            const destDir = newprojectdir;
            fse.copySync(srcDir, destDir);
        });


        // Preparing initial HTML
        setTimeout(function () {
            fs.readFile(newprojectdir + "/index.html", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                }
                newhtml = data;
                var newhtml = data.replace("<title>TITLE</title>", "<title>" + newprojectname + "</title>");
                data = newhtml;
                var newhtml = data.split("/*panoramas*/")[0] + "/*panoramas*/\n\r" + generatePanoramas(initialProjectData.panoramas) + "\n\r/*panoramas-end*/" + data.split("/*panoramas-end*/")[1];
                fs.writeFile(newprojectdir + "/index.html", newhtml, function (err) {
                    if (err) 
                        return console.log(err);
                    


                    console.log("Project title is set!");

                    wtmdata.projects.push({
                        projectdir: newprojectdir.replace(/\\/g, "/"),
                        projectname: newprojectname
                    });

                    saveWtmdata();
                    loadRecentProjects();

                    // Preview the Project
                    editproject(wtmdata.projects.length - 1);

                    hideDim();

                    $("#newprojectname").val("").focus();
                    $("#newprojectdir").html("");
                    newprojectname = "";
                    newprojectdir = "";

                });
            });
        }, 3000);
    }, 1000);
}


function loadRecentProjects() {
    $("#recentprojects").html("");
    if (wtmdata.projects.length > 0) {
        for (var i = 0; i < wtmdata.projects.length; i++) {
            var cardBackground = "";
            if (fs.existsSync(wtmdata.projects[i].projectdir)) {
                var projectPanoramasDir = wtmdata.projects[i].projectdir + "/panoramas/";
                var projectFirstPanoramaPath = "";
                if (fs.existsSync(projectPanoramasDir)) { // Encontra a primeira imagem panorâmica no diretório de panoramas do projeto
                    var panoramas = fs.readdirSync(projectPanoramasDir);
                    if (panoramas.length > 0) {
                        for (var j = 0; j < panoramas.length; j++) {
                            if (panoramas[j].match(/\.(jpg|jpeg|png|gif)$/i)) {
                                projectFirstPanoramaPath = projectPanoramasDir + panoramas[j];
                                break;
                            }
                        }
                    }
                }
                if (projectFirstPanoramaPath != "" && fs.existsSync(projectFirstPanoramaPath)) {
                    cardBackground = "background: url(" + projectFirstPanoramaPath + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;";
                } else {
                    var projectThumbPath = wtmdata.projects[i].projectdir + "/panoramas/testpanorama.jpg";
                    if (fs.existsSync(projectThumbPath)) {
                        cardBackground = "background: url(" + projectThumbPath + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;";
                    }
                }

                $("#recentprojects").prepend(`
                <head>
                <link rel="stylesheet" type="text/css" href="card-styles.css">
              </head>
              <div class="card project-card">
              <div class="card-content">
                <div class="card-header" style="cursor: pointer;" onclick="editproject(${i})">
                  <div style="font-size: 20px;">${
                    wtmdata.projects[i].projectname
                }</div>
                </div>
                <div class="card-body">
                <div class="button" onclick="exportProject(${i})">
                <i class="fa fa-upload"></i>
                <span data-i18n="export"></span>
              </div>
                <div class="button" onclick="showInExplorer(${i})" >
                <i class="fa fa-folder"></i>
                <span data-i18n="show_in_explorer" ></span> 
              </div>
              <div class="redbutton" onclick="removeFromProjectList(${i})">
              <i class="fa fa-trash"></i>
              <span data-i18n="remove_from_list"></span>
            </div>
            
            <div class="redbutton" onclick="deleteProject(${i})">
              <i class="fa fa-trash"></i>
              <span data-i18n="delete_project"></span>
            </div>
                </div>
              </div>
              <div class="card-background-right" style="${cardBackground}"></div>
            </div>
            
                `);
            } else {
                $("#recentprojects").prepend(`
                    <div class='card project-card'>
                        <div class='card-header' style='color: #51545D; font-style: italic;'>
                            <div style='font-size: 20px;'><i class='fa fa-warning'></i> ${
                    wtmdata.projects[i].projectname
                } (Not Found)</div>
                            <div style='font-size: 12px; color: #51545D;'>${
                    wtmdata.projects[i].projectdir
                }</div>
                        </div>
                        <div class='card-body'>
                        <div class="redbutton" onclick="removeFromProjectList(${i})">
                        <i class="fa fa-trash"></i>
                        <span data-i18n="remove_from_list"></span>
                      </div>
                        </div>
                    </div>
                `);
            }
        }
        $(".projectlist").hide();
        var num = 0;
        $(".projectlist").each(function () {
            $(".projectlist").eq(num).delay(num * 100).fadeIn();
            num++;
        });
        limitHeight();
    } else { // bug esta aqui

        $("#recentprojects").html('<span data-i18n="noproject"></span>');
    };
}

function showpageAndReload(page) {
    showpage(page);
    reloadApp();
}


const JSZip = require('jszip');

function exportProject(idx) {
    var dir = wtmdata.projects[idx].projectdir;
    var projectName = wtmdata.projects[idx].projectname;
    const date = new Date();
    const formattedDate = `${
        date.getFullYear()
    }${
        (date.getMonth() + 1).toString().padStart(2, '0')
    }${
        date.getDate().toString().padStart(2, '0')
    }_${
        date.getHours().toString().padStart(2, '0')
    }${
        date.getMinutes().toString().padStart(2, '0')
    }`;
    const zipName = `${formattedDate}_${
        path.basename(projectName)
    }.zip`;
    const outputPath = path.join(predefinedDirExport, zipName);

    if (! predefinedDir) {
        console.error('Caminho do projeto não definido');
        return;
    }

    const zip = new JSZip();
    const rootFolder = path.basename(dir);

    addFolderToZip(zip, dir, rootFolder);

    zip.generateAsync({type: 'nodebuffer'}).then(function (content) {
        const zipOutputPath = path.join(predefinedDirExport, `${rootFolder}.zip`);
        fs.writeFileSync(outputPath, content);
        console.log(`Arquivo ZIP gerado em ${outputPath}`);
        // document.getElementById('status').textContent = 'Projeto exportado com sucesso';
        showAlert(i18next.t('export'), i18next.t('export_sucess'));
    }).catch(function (err) {
        console.error(err);
    });
}

function addFolderToZip(zip, folderPath, folderName) {
    const folder = zip.folder(folderName);
    const files = fs.readdirSync(folderPath);

    files.forEach(function (fileName) {
        const filePath = path.join(folderPath, fileName);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            addFolderToZip(folder, filePath, fileName);
        } else {
            const fileContent = fs.readFileSync(filePath);
            folder.file(fileName, fileContent);
        }
    });
}


function editProjectName(index) {
    var projectName = wtmdata.projects[index].projectname;
    var newProjectName = prompt("Digite o novo nome do projeto:", projectName);
    if (newProjectName !== null && newProjectName !== "") {
        wtmdata.projects[index].projectname = newProjectName;
        saveData();
        loadRecentProjects();
    }
}

function deleteProject(index) {
    showYesNoAlert(i18next.t('confirm_delete'), i18next.t('delete_project_warning'), function () {
        const project = wtmdata.projects[index];
        const projectDir = project.projectdir;

        if (fs.existsSync(projectDir)) {
            try {
                fs.rmdirSync(projectDir, {recursive: true});
            } catch (err) {
                console.error(err);
                showAlertDialog(i18next.t('error'), i18next.t('delete_project_error'));
                return;
            }
            reloadApp();
        }

        wtmdata.projects.splice(index, 1);
        saveWtmdata();
        loadRecentProjects();
    });
}

function removeFromProjectList(index) {
    const confirmationMsg = i18next.t('confirm_remove_project');
    showYesNoAlert(i18next.t('are_you_sure'), confirmationMsg, function () {
        wtmdata.projects.splice(index, 1);
        saveWtmdata();
        loadRecentProjects();
        reloadApp();
    });

}

function showInExplorer(idx) {
    var dir = wtmdata.projects[idx].projectdir;

    if (dir.indexOf(" ") > -1) {
        showAlert(i18next.t('whitespace_problem'), i18next.t('whitespace_problem_msg') + "<br>" + dir);
    } else {
        console.log("Trying to open in dir: " + dir);
        require("child_process").exec('start "" ' + dir);
    }

}

function isProjectExist(title, dir) {
    for (var i = 0; i < wtmdata.projects.length; i++) {
        if (wtmdata.projects[i].projectdir == dir) 
            return true;
        


    }
    return false;
}

loadRecentProjects();

function previewProject(idx) {
    generateHTMLPanoramas();
    showDim("A construir...");
    setTimeout(function () {
        var ppath = wtmdata.projects[idx].projectdir + "/index.html";
        var newwin = new BrowserWindow({width: 1280, height: 720, title: "Project Preview", icon: "icon.ico"});
        newwin.loadFile(ppath);
        newwin.removeMenu();
        // newwin.webContents.openDevTools();
        hideDim();
    }, 2000);
}

function generatePanoramas(arr) {
    var pdata = "";
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var panovar = arr[i].panofile.split(".")[0];
            pdata += "var " + panovar + ' = new PANOLENS.ImagePanorama( "panoramas/' + arr[i].panofile + '" );\n\
			' + panovar + ".addEventListener('progress', function(e){\n\
				$(\"#loading\").show();\n\
			});\n\
			" + panovar + ".addEventListener('load', function(e){\n\
				$(\"#loading\").fadeOut();\n\
			});\n\
			" + panovar + ".addEventListener('click', function(e){\n\
			});\n\r\n\r";

            for (var x = 0; x < arr[i].hotspots.length; x++) {
                var hicon = 0;
                if (arr[i].hotspots[x].icon != undefined) {
                    hicon = arr[i].hotspots[x].icon;
                }

                pdata += "var infospot" + panovar + x + " = new PANOLENS.Infospot( 512, hotspotIcons[" + hicon + "].data, true );\n\
				infospot" + panovar + x + ".position.set( " + arr[i].hotspots[x].position + " );\n\
				" + panovar + ".add(infospot" + panovar + x + ");\n\r";

                // Does it have hover text?
                if (arr[i].hotspots[x].stoh != undefined && arr[i].hotspots[x].stoh == 1) {
                    pdata += "infospot" + panovar + x + ".addHoverText( '" + arr[i].hotspots[x].title + "' );\n\r";
                }

                pdata += "infospot" + panovar + x + ".addEventListener('click', function(){\n\r";
                // Lets check if the infospot has actions in it
                if (arr[i].hotspots[x].actions.length > 0) {
                    var cactions = arr[i].hotspots[x].actions;
                    for (var y = 0; y < cactions.length; y++) { // If it is opening another Panorama
                        var actiontype = cactions[y].type;
                        if (actiontype == 0) {
                            var targetpanorama = cactions[y].target.split(".")[0];
                            targetpanorama = targetpanorama.split("/")[1];
                            pdata += "ChangePanorama('" + targetpanorama + "');\n\r";
                        } else {
                            pdata += "showMedia(" + actiontype + ", '" + cactions[y].target + "');\n\r";
                        }
                    }
                }
                if (arr[i].hotspots[x].url != undefined && arr[i].hotspots[x].url != "") {
                    pdata += "window.open( '" + arr[i].hotspots[x].url + "', '_blank');\n\r";
                }
                if (arr[i].hotspots[x].js != undefined && arr[i].hotspots[x].js != "") {
                    pdata += arr[i].hotspots[x].js + "\n\r";
                }
                pdata += "});\n\r";
            }

            // Adding the infospot to the stage
            pdata += "viewer.add( " + panovar + " );\n\r";
            // console.log("JS Code for this panorama has been added: " + panovar);
        }pdata += "$(document).ready(function(){ ChangePanorama('" + remSpaces(currentprojectdata.settings.firstpanorama.split(".")[0]) + "'); });\n";
    }
    return pdata;
}

function hideDim() {
    $("#dim").fadeOut();
    $("#loading").hide();
}

function showDim(message) {
    $("#dimmessage").html(message);
    $("#dim").show();
    $("#loading").show();
}

function showAlert(title, message) {
    $("#dimmessage").html("<div class='yes-no-box'>" + "<div class='ok-title'>" + "<i class='fa fa-question-circle'></i> " + title + "</div>" + "<div class='yes-no-message'>" + "<div>" + message + "</div>" + "<button class='yes-btn' onclick='hideDim()'>Ok</button>" + "</div>" + "</div>");

    $("#dim").show();
    $("#loading").hide();
}
function showImage(title, image) {
    $("#dimmessage").html("<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background-color: rgba(0, 0, 0, 0.8);'>" + "<div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 80%; max-height: 80%;'>" + "<div style='color: white; padding: 10px;'>" + title.substring(0, 30) + "</div>" + "<div style='background-color: #3d4855; font-size: 14px; font-weight: normal; overflow: hidden; height: 100%;'>" + "<div style='text-align: center; overflow: hidden; height: 100%;'>" + "<img src='" + image + "' style='max-width: 100%; max-height: 100%; display: inline-block;'>" + "</div>" + "<button onclick='hideDim()' style='position: absolute; top: 0; right: 0; margin: 0px;'><i class='fa fa-times'></i> " + i18next.t('close') + "</button>" + "</div>" + "</div>" + "</div>");
    $("#dim").show();
    $("#loading").hide();
}


var doit;
function showYesNoAlert(title, message, fn) {
    $("#dimmessage").html("<div class='yes-no-box'>" + "<div class='yes-no-title'>" + "<i class='fa fa-question-circle'></i> " + title + "</div>" + "<div class='yes-no-message'>" + "<div>" + message + "</div>" + "<button class='yes-btn' onclick='doit(); hideDim()'><i class='fa fa-check'></i>"+ i18next.t('yes') + "</button>" + "<button class='no-btn' onclick='hideDim()'><i class='fa fa-times'></i>"+ i18next.t('close') + "</button>" + "</div>" + "</div>");
    $("#dim").show();
    $("#loading").hide();

    doit = function () {
        fn();
    };
}


function showItemChooser(cid, title, dir, fn) {
    doit = function () {
        fn();
    };

    var itemstochoose = "";
    var workingdir = wtmdata.projects[currentprojectindex].projectdir + "/" + dir + "/";
    if (!fs.existsSync(workingdir)) {
        fs.mkdirSync(workingdir);
    }
    function extokay(dir, ext) {
        if (dir == "images") {
            if (ext == "JPG" || ext == "jpg" || ext == "jpeg" || ext == "png") 
                return true;
            


        } else if (dir == "panoramas") {
            if (ext == "JPG" || ext == "jpg" || ext == "jpeg" || ext == "png") 
                return true;
            


        } else if (dir == "videos") {
            if (ext == "mp4") 
                return true;
            


        } else if (dir == "audios") {
            if (ext == "mp3") 
                return true;
            


        } else if (dir == "pdf") {
            if (ext == "pdf") 
                return true;
            


        } else {
            return false;
        }
    }

    function fthumb(fname) {
        var ext = fname.split(".")[fname.split(".").length - 1];
        if (ext == "JPG" || ext == "jpg" || ext == "jpeg" || ext == "png") {
            return("<div style='margin-bottom: 10px;'><img src='" + workingdir + "/" + fname + "' style='height: 96px'></div>");
        } else if (ext == "mp4") {
            return "<div style='margin-bottom: 10px;'><i class='fa fa-film' style='font-size: 60px;'></i></div>";
        } else if (ext == "mp3") {
            return "<div style='margin-bottom: 10px;'><i class='fa fa-music' style='font-size: 60px;'></i></div>";
        } else if (ext == "pdf") {
            return "<div style='margin-bottom: 10px;'><i class='fa fa-file-pdf-o' style='font-size: 60px;'></i></div>";
        }
    }

    fs.readdirSync(workingdir).forEach((file) => {
        if (extokay(dir, file.split(".")[file.split(".").length - 1])) {
            itemstochoose += "<div onclick='setChosenItem(\"" + cid + '", "' + dir + "/" + file + "\")' style='display: inline-block; margin-right: 10px; margin-bottom: 10px; text-align: center; cursor: pointer;'><div>" + fthumb(file) + "</div><div style='font-size: 10px;'>" + truncate(file, 20) + "</div></div>";
        }
    });

    $("#dimmessage").html("").html("<div style='width: 100%; max-width: 720px; height: 100%; margin: 0 auto;'><div style='background-color: #2c3643; color: white; padding: 10px;'><i class='fa fa-question-circle'></i> " + title + "</div><div style='padding: 30px; background-color: #3d4855; font-size: 14px; font-weight: normal;'><div style='box-sizing: border-box; width: 100%; height: " + (
        innerHeight - 400
    ) + "px; overflow: auto;'>" + itemstochoose + "</div><button onclick='hideDim()' style='margin-left: 10px; margin-top: 20px; margin-bottom: 0px;'><i class='fa fa-times'></i> Close</button></div></div>");
    $("#dim").show();
    $("#loading").hide();
}

// Showing hotspot icon chooser
function showIconChooser(cid, title) {
    var itemstochoose = "";

    for (var i = 0; i < hotspotIcons.length; i++) {
        itemstochoose += "<div onclick='setHotspotIcon(\"" + cid + '", ' + i + ")' style='display: inline-block; margin-right: 10px; margin-bottom: 10px; text-align: center; cursor: pointer;'><div><img src='" + hotspotIcons[i].data + "' style='height: 96px;'></div><div style='font-size: 10px;'>" + hotspotIcons[i].name + "</div></div>";
    }

    $("#dimmessage").html("").html("<div style='width: 100%; max-width: 720px; height: 100%; margin: 0 auto;'><div style='background-color: #2c3643; color: white; padding: 10px;'><i class='fa fa-question-circle'></i> " + title + "</div><div style='padding: 30px; background-color: #3d4855; font-size: 14px; font-weight: normal;'><div style='box-sizing: border-box; width: 100%; height: " + (
        innerHeight - 400
    ) + "px; overflow: auto;'>" + itemstochoose + "</div><button onclick='hideDim()' style='margin-left: 10px; margin-top: 20px; margin-bottom: 0px;'><i class='fa fa-times'></i> Close</button></div></div>");
    $("#dim").show();
    $("#loading").hide();
}

// Set chosen item after showing the item chooser
function setChosenItem(cid, file) {
    tempSourceFile = file;
    doit();
}

// Set chosen item of hotspot icon
function setHotspotIcon(cid, idx) {
    var res = isCidMatched(cid);
    currentprojectdata.panoramas[res.pano].hotspots[res.hot].icon = idx;
    updateWtmFile();
    showeditorc("hotspots");
    hideDim();
}

function showMiniPage(type) {
    switch (type) {
        case "about": showAlert(i18next.t('about_title'), "<h1>MIT3DVisit</h1><h3>" + i18next.t('version') + " 0.0.1</h3><p>" + i18next.t('built_with') + "</p><div style='background-color: white;'><img src='imgs/poweredby.png' style='width: 100%;'></div><p style='margin-top: 20px;'>" + i18next.t('developed_by') + "</p><a href='https://www.mitmynid.com/'><img src='imgs/logo_mmn.png' style='width: 100%'></a><p>");
            break;
            // case "donate": showAlert("Support The Development", "<p><img src='imgs/paypal.png' style='background-color: white; padding: 20px;'></p><p>This software is made for you for free. However, I expect any amount donations from users like you to keep me supported for maintenance and further development of this software.</p><p>Please send your donation to my PayPal account here: <a href='https://paypal.me/habibieamrullah'>https://paypal.me/habibieamrullah</a></p>");
            //     break;
    }
}

hideDim();

function quitprogram() {
    ipcRenderer.send("quitprogram");
}

function minimize() {
    var currentWindow = BrowserWindow.getFocusedWindow();
    currentWindow.minimize();
}

function maximize() {
    var window = BrowserWindow.getFocusedWindow();
    if (window.isMaximized()) {
        window.unmaximize();
        $(".minmaxbutton").html("<i class='fa fa-window-maximize'></i>");
    } else {
        window.maximize();
        $(".minmaxbutton").html("<i class='fa fa-window-restore'></i>");
    }
}
function showpage(pid) {
    $(".page").hide();
    $("#" + pid).fadeIn();
    switch (pid) {
        case "projects": loadRecentProjects();
            break;
    }

    limitHeight();
}

// Function to generate random characters
function randomblah(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Function to truncate string
function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

var currentprojectindex;
var currentpanoramaindex;
var currentprojectdata;
var tempstring;
var tempTimeout;

function runProject() {
    if (!currentprojectdata.settings.firstpanorama) {
        showAlert(i18next.t("attention"), i18next.t("definePanorama"));
        return;
    }
    previewProject(idx);
}

function editproject(idx) {
    var fullPath = wtmdata.projects[idx].projectdir;
    var lastSeparator = fullPath.lastIndexOf("/");
    var folderName = fullPath.substring(lastSeparator + 1);
    var parentFolder = fullPath.substring(0, lastSeparator);
    var parentSeparator = parentFolder.lastIndexOf("/");
    var parentFolderName = parentFolder.substring(parentSeparator + 1);

    currentprojectindex = idx;
    showpage("projecteditor");
    $("#currentprojecttitle").val(wtmdata.projects[idx].projectname);
    $("#currentprojectdir").html("<i class='fa fa-folder' style='width: 30px;'></i>" + parentFolderName + " / " + folderName)
    $("#currentprojectrunbutton").on("click", function() {
        if (!currentprojectdata.settings.firstpanorama) {
            showAlert(i18next.t("attention"), i18next.t("definePanorama"));
            return;
        }
        previewProject(idx);
    });
    fs.readFile(wtmdata.projects[idx].projectdir + "/WTMProject.wtm", "utf8", function (err, data) {
        if (err) {
            showAlert(i18next.t('corrupted_project'), i18next.t('corrupted_project_msg'));
            showpage("projects");
            return;
        }
        currentprojectdata = JSON.parse(data);
        showeditorc("panoramas");
    });
}

function showeditorc(type) {
    switch (type) {
        case "panoramas":
            var panoramas = `<h2>${
                i18next.t("panoramic_images")
            }</h2>`;
            for (var i = 0; i < currentprojectdata.panoramas.length; i++) {
                var itsmainpano = "";
                var itsmainpanogreen = "background-color: #51545D; color: black;";
                var itsmainpanoaction = " onclick='setitasmainpano(" + i + ")'";
                var itsmainpanotrash = "";
                if (currentprojectdata.panoramas[i].panofile == currentprojectdata.settings.firstpanorama) {
                    itsmainpano = "<i class='fa fa-home'></i> ";
                    itsmainpanogreen = "background-color: #0d9e59; color: white;";
                    var itsmainpanoaction = ` onclick='showAlert("${
                        i18next.t("main_pano_alert_title")
                    }", "${
                        i18next.t("main_pano_alert_message")
                    }");'`;
                    itsmainpanotrash = "";
                }
                panoramas += "<div class='imgthumb' style='position: relative; background: url(" + wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + currentprojectdata.panoramas[i].panofile + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;'><span" + itsmainpanoaction + " style='" + itsmainpanogreen + " cursor: pointer; font-weight: bold; padding: 5px; font-size: 10px;'>" + itsmainpano + truncate(currentprojectdata.panoramas[i].panofile, 15) + "</span><div style='position: absolute; bottom: 0; right: 0;'><div onclick=\"showImage('" + currentprojectdata.panoramas[i].panofile + "', '" + wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + currentprojectdata.panoramas[i].panofile + "');\" class='greenbutton'><i class='fa fa-eye'></i></div><div onclick='removePanorama(" + i + ")' class='redbutton' style='" + itsmainpanotrash + "'><i class='fa fa-trash'></i></div></div></div>";
            }
            $("#editorcontent").html(panoramas + "<div class='imgthumb' onclick='addpanorama()'><div style='cursor: pointer; display: table; width: 100%; height: 100%;'><div style='display: table-cell; text-align: center; vertical-align: middle;'><i class='fa fa-plus' style='font-size: 40px;'></i></div></div></div>");
            break;
        case "settings":
            var cbsetting = "";
            if (currentprojectdata.settings.controls == 1) 
                cbsetting = " selected";
            


            $("#editorcontent").html(`
                <h2>${
                i18next.t("settings")
            }</h2>
                <div style="display: table; width: 100%; table-layout: fixed;">
                  <div style="display: table-cell; vertical-align: top; padding-right: 10px;">
                    <p>${
                i18next.t("project_description")
            }</p>
                    <input placeholder="${
                i18next.t("short_description")
            }" id="psdescription" value="${
                currentprojectdata.settings.description
            }">
                    <p>${
                i18next.t("loading_text_load")
            }</p>
                    <input id="psloadingtext" placeholder="${
                i18next.t("loading_text_placeholder")
            }" value="${
                currentprojectdata.settings.loadingtext
            }">
                  </div>
                  <div style="display: table-cell; vertical-align: top;">
                    <p>${
                i18next.t("first_panorama")
            }</p>
                    <select id="firstpanorama">${
                getPanoramasNameOption()
            }</select>
                    <p>${
                i18next.t("viewer_settings")
            }</p>
                    <select id="pscontrols">
                      <option value="0">${
                i18next.t("no")
            }</option>
                      <option value="1"${cbsetting}>${
                i18next.t("yes")
            }</option>
                    </select>
                  </div>
                </div>
                <button onclick="saveProjectSettings()"><i class="fa fa-floppy-o"></i> ${
                i18next.t("save")
            }</button>
              `);
            // <p>Default Tour Mode</p><select><option>Normal</option><option>Cardboard</option><option>Stereoscopic</option></select>
            break;
        case "hotspots": ReloadEditorHotspots();
            break;

        case "imageassets":
            var imagefiles = "";
            var workingdir = wtmdata.projects[currentprojectindex].projectdir + "/images/";
            if (!fs.existsSync(workingdir)) {
                fs.mkdirSync(workingdir);
            }
            fs.readdirSync(workingdir).forEach((file) => {
                if (file.split(".")[file.split(".").length - 1] == "JPG" || file.split(".")[file.split(".").length - 1] == "jpg" || file.split(".")[file.split(".").length - 1] == "jpeg" || file.split(".")[file.split(".").length - 1] == "png") {
                    imagefiles += "<div class='imgthumb' style='position: relative; background: url(" + wtmdata.projects[currentprojectindex].projectdir + "/images/" + file + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;'><span style='background-color: black; color: white; font-weight: bold; padding: 5px; font-size: 10px;'>" + truncate(file, 20) + "</span><div style='position: absolute; bottom: 0; right: 0;'><div onclick=\"showImage('" + file + "', '" + wtmdata.projects[currentprojectindex].projectdir + "/images/" + file + "');\" class='greenbutton'><i class='fa fa-eye'></i></div><div onclick=removeImageasset('" + wtmdata.projects[currentprojectindex].projectdir + "/images/" + file + "') class='redbutton'><i class='fa fa-trash'></i></div></div></div>";
                }
            });
            $("#editorcontent").html(`
            <h2>${
                i18next.t("images")
            }</h2>
            ${imagefiles}
            <div class='imgthumb' onclick='addImageasset()'>
                <div style='cursor: pointer; display: table; width: 100%; height: 100%;'>
                    <div style='display: table-cell; text-align: center; vertical-align: middle;'>
                        <i class='fa fa-plus' style='font-size: 40px;'></i>
                    </div>
                </div>
            </div>
        `);
            break;

        case "videos":
            var tmpfiles = "";
            var workingdir = wtmdata.projects[currentprojectindex].projectdir + "/videos/";
            if (!fs.existsSync(workingdir)) {
                fs.mkdirSync(workingdir);
            }
            fs.readdirSync(workingdir).forEach((file) => {
                if (file.split(".")[file.split(".").length - 1] == "mp4") {
                    tmpfiles += "<div style='display: inline-block; margin-right: 20px; margin-bottom: 20px;'><div style='display: table;'><div style='background-color: #2c3643; display: table-cell; padding: 10px;'><i class='fa fa-film'></i> " + truncate(file, 30) + "</div><div class='redbutton' style='margin: 0px; padding: 10px; display: table-cell;' onclick=removeVideofile('" + wtmdata.projects[currentprojectindex].projectdir + "/videos/" + file + "')><i class='fa fa-trash'></i></div></div></div>";
                }
            });
            $("#editorcontent").html(`<h2>${
                i18next.t("videos")
            }</h2><div>${tmpfiles}</div><div class='imgthumb' style='height: 50px; width: 250px;' onclick='addVideofile()'><div style='cursor: pointer; display: table; width: 100%; height: 100%;'><div style='display: table-cell; text-align: center; vertical-align: middle;'><i class='fa fa-plus' style='font-size: 20px;'></i> ${
                i18next.t("add_new_file")
            }</div></div></div>`);

            break;
        case "audios":
            var tmpfiles = "";
            var workingdir = wtmdata.projects[currentprojectindex].projectdir + "/audios/";
            if (!fs.existsSync(workingdir)) {
                fs.mkdirSync(workingdir);
            }
            fs.readdirSync(workingdir).forEach((file) => {
                if (file.split(".")[file.split(".").length - 1] == "mp3") {
                    tmpfiles += "<div style='display: inline-block; margin-right: 20px; margin-bottom: 20px;'><div style='display: table;'><div style='background-color: #2c3643; display: table-cell; padding: 10px;'><i class='fa fa-film'></i> " + truncate(file, 30) + "</div><div class='redbutton' style='margin: 0px; padding: 10px; display: table-cell;' onclick=removeAudiofile('" + wtmdata.projects[currentprojectindex].projectdir + "/audios/" + file + "')><i class='fa fa-trash'></i></div></div></div>";
                }
            });
            $("#editorcontent").html(`
            <h2>${
                i18next.t("audios")
            }</h2>
            <div>${tmpfiles}</div>
            <div class="imgthumb" style="height: 50px; width: 250px;" onclick="addAudiofile()">
              <div style="cursor: pointer; display: table; width: 100%; height: 100%;">
                <div style="display: table-cell; text-align: center; vertical-align: middle;">
                  <i class="fa fa-plus" style="font-size: 20px;"></i> ${
                i18next.t("add_new_file")
            }
                </div>
              </div>
            </div>
          `);
            break;
        case "pdfs":
            var tmpfiles = "";
            var workingdir = wtmdata.projects[currentprojectindex].projectdir + "/pdf/";
            if (!fs.existsSync(workingdir)) {
                fs.mkdirSync(workingdir);
            }
            fs.readdirSync(workingdir).forEach((file) => {
                if (file.split(".")[file.split(".").length - 1] == "pdf") {
                    tmpfiles += "<div style='display: inline-block; margin-right: 20px; margin-bottom: 20px;'><div style='display: table;'><div style='background-color: #2c3643; display: table-cell; padding: 10px;'><i class='fa fa-file-pdf-o'></i> " + truncate(file, 30) + "</div><div class='redbutton' style='margin: 0px; padding: 10px; display: table-cell;' onclick=removePdffile('" + wtmdata.projects[currentprojectindex].projectdir + "/pdf/" + file + "')><i class='fa fa-trash'></i></div></div></div>";
                }
            });
            $("#editorcontent").html(`
    <h2>${
                i18next.t("pdf_documents")
            }</h2>
    <div>${tmpfiles}</div>
    <div class='imgthumb' style='height: 50px; width: 250px;' onclick='addPdffile()'>
        <div style='cursor: pointer; display: table; width: 100%; height: 100%;'>
            <div style='display: table-cell; text-align: center; vertical-align: middle;'>
                <i class='fa fa-plus' style='font-size: 20px;'></i> ${
                i18next.t("add_new_file")
            }
            </div>
        </div>
    </div>
`);
            break;

    }
    limitHeight();
}

// HOTSPOTS Operations//
// Show add new action dialog
function hotShowAddNewAction(cid) {
    $("#hotscreen" + cid).hide().html("<div><h4>" + i18next.t('chooseAction') + "</h4></div><select id='haction" + cid + "' onchange=showactioncontent('" + cid + "')><option>" + i18next.t('chooseopt') + "</option><option value=1>" + i18next.t('openPanorama') + "</option><option value=2>" + i18next.t('showImage') + "</option><option value=3>" + i18next.t('playVideo') + "</option><option value=4>" + i18next.t('playAudio') + "</option><option value=5>" + i18next.t('openPdfFile') + "</option><option value=6>" + i18next.t('openUrl') + "</option><option value=7>" + i18next.t('executeJavaScript') + "</option></select><div id='hotactioncontent" + cid + "'></div><div class='button' onclick=showeditorc('hotspots') style='margin: 5px;'><i class='fa fa-floppy-o'></i> " + i18next.t('save') + "</div><div class='button' onclick=hotGoHome(\"" + cid + "\") style='margin: 5px;'><i class='fa fa-times'></i> " + i18next.t('close') + "</div>").show();

    $("#hothome" + cid).hide();
}

// showactioncontent
function showactioncontent(cid) {
    var currentaction = parseInt($("#haction" + cid).val());
    var acontent = "";
    var res = isCidMatched(cid);
    switch (currentaction) {
        case 1: acontent = "<p>" + i18next.t('openPanoramaDestiny') + "</p><input placeholder='" + i18next.t('choose') + "' readonly onclick='hchoose(0, \"" + cid + "\");'>";
            break;
        case 2: acontent = "<p>" + i18next.t('openImage') + "</p><input placeholder='" + i18next.t('choose') + "' readonly onclick='hchoose(1, \"" + cid + "\");'>";
            break;
        case 3: acontent = "<p>" + i18next.t('playVideo') + "</p><input placeholder='" + i18next.t('choose') + "....' readonly onclick='hchoose(2, \"" + cid + "\");'>";
            break;
        case 4: acontent = "<p>" + i18next.t('playAudio') + "</p><input placeholder='" + i18next.t('choose') + "' readonly onclick='hchoose(3, \"" + cid + "\");'>";
            break;
        case 5: acontent = "<p>" + i18next.t('openPdfFile') + "</p><input placeholder='" + i18next.t('choose') + "' readonly onclick='hchoose(4, \"" + cid + "\");'>";
            break;
        case 6:
            var currenthurl = "";
            if (currentprojectdata.panoramas[res.pano].hotspots[res.hot].url != undefined) 
                currenthurl = currentprojectdata.panoramas[res.pano].hotspots[res.hot].url;
            


            acontent = "<p>" + i18next.t('openUrl') + "</p><input placeholder='https://example.com' id='hactionurlinput" + cid + "' onkeyup='savehactionurl(\"" + cid + "\")' value='" + currenthurl + "'>";
            break;
        case 7:
            var currenthjs = "";
            if (currentprojectdata.panoramas[res.pano].hotspots[res.hot].js != undefined) 
                currenthjs = currentprojectdata.panoramas[res.pano].hotspots[res.hot].js;
            


            acontent = "<p>" + i18next.t('executeJavaScript') + "</p><textarea placeholder='Escreva o seu JavaScript aqui...' id='hactionjsinput" + cid + "' onkeyup='savehactionjs(\"" + cid + "\")'>" + currenthjs + "</textarea>";
            break;
    }
    $("#hotactioncontent" + cid).html(acontent);

}

// Show configs panel
function hotShowConfigs(cid) {
    var projectdir = wtmdata.projects[currentprojectindex].projectdir;
    var hotspoticon = "/imgs/hotspot.png";
    var res = isCidMatched(cid);
    var currenthotspot = currentprojectdata.panoramas[res.pano].hotspots[res.hot];
    if (currenthotspot.icon != undefined && currenthotspot.icon != "") {
        hotspoticon = "/" + currenthotspot.icon;
    }
    var hotspotfilename = hotspoticon.split("/")[hotspoticon.split("/").length - 1];
    var stoh = "";
    if (currenthotspot.stoh != undefined && currenthotspot.stoh == 1) {
        stoh = " selected";
    }
    $("#hothome" + cid).hide();

    $("#hotscreen" + cid).hide().html("<h4>" + i18next.t('hotspotIconLabel') + "</h4><p>" + i18next.t('clickToChangeLabel') + "</p><div onclick='changehotspoticon(\"" + cid + "\");' style='width: 92px; height: 92px; margin: 0 auto; margin-bottom: 20px; background: url(" + projectdir + hotspoticon + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;'></div><input value='" + hotspotfilename + "' readonly onclick='changehotspoticon(\"" + cid + "\");'><p>" + i18next.t('showTitleOnHoverLabel') + "</p><select id='showtitleonhover" + cid + "' onchange='applyshowtoh(\"" + cid + "\")'><option value=0>" + i18next.t('noLabel') + "</option><option value=1" + stoh + ">" + i18next.t('yesLabel') + "</option></select><p>" + i18next.t('currentHotspotLocationLabel') + "<br>(Click the input below to change)</p><input value='" + currenthotspot.position + "' readonly><div class='button' onclick=hotGoHome(\"" + cid + "\") style='margin: 5px;'><i class='fa fa-floppy-o'></i> " + i18next.t('saveButtonLabel') + "</div><div class='button' onclick=hotGoHome(\"" + cid + "\") style='margin: 5px;'><i class='fa fa-times'></i> " + i18next.t('closeButtonLabel') + "</div>").show();
}


// Go hot home
function hotGoHome(cid) {
    $("#hothome" + cid).hide().show();
    $("#hotscreen" + cid).hide();
}

// save action url
function savehactionurl(cid) {
    clearTimeout(tempTimeout);
    tempTimeout = setTimeout(function () {
        var urltoopen = $("#hactionurlinput" + cid).val();
        if (urltoopen.indexOf("http") > -1) {
            console.log("Action URL: " + urltoopen);
            var res = isCidMatched(cid);
            currentprojectdata.panoramas[res.pano].hotspots[res.hot].url = urltoopen;
            updateWtmFile();
        }
    }, 1000);
}

// save action js
function savehactionjs(cid) {
    clearTimeout(tempTimeout);
    tempTimeout = setTimeout(function () {
        var jstorun = $("#hactionjsinput" + cid).val();
        if (jstorun != "") {
            console.log("Saving JS code: " + jstorun);
            var res = isCidMatched(cid);
            currentprojectdata.panoramas[res.pano].hotspots[res.hot].js = jstorun;
            updateWtmFile();
        }
    }, 1000);
}

// hchoose for add actions
function hchoose(type, cid) {
    switch (type) {
        case 0: showItemChooser(cid, i18next.t('panoramaDestination'), "panoramas", function () {
                var res = isCidMatched(cid);
                currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.push({type: 0, target: tempSourceFile});
                console.log(i18next.t('actionAdded'));
                updateWtmFile();
                showeditorc("hotspots");
                hideDim();
            });
            break;
        case 1:
            if (!isProcessing) {
                isProcessing = true;
                showItemChooser(cid, i18next.t('chooseImage'), "images", function () {
                    var res = isCidMatched(cid);
                    currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.push({type: 1, target: tempSourceFile});
                    console.log(i18next.t('actionAdded'));
                    updateWtmFile();
                    showeditorc("hotspots");
                    hideDim();
                    isProcessing = false;
                });
            }
            break;
        case 2: showItemChooser(cid, i18next.t('chooseVideo'), "videos", function () {
                var res = isCidMatched(cid);
                currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.push({type: 2, target: tempSourceFile});
                console.log(i18next.t('actionAdded'));
                updateWtmFile();
                showeditorc("hotspots");
                hideDim();
            });
            break;
        case 3: showItemChooser(cid, i18next.t('chooseAudio'), "audios", function () {
                var res = isCidMatched(cid);
                currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.push({type: 3, target: tempSourceFile});
                console.log(i18next.t('actionAdded'));
                updateWtmFile();
                showeditorc("hotspots");
                hideDim();
            });
            break;
        case 4: showItemChooser(cid, i18next.t('choosePdf'), "pdf", function () {
                var res = isCidMatched(cid);
                currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.push({type: 4, target: tempSourceFile});
                console.log(i18next.t('actionAdded'));
                updateWtmFile();
                showeditorc("hotspots");
                hideDim();
            });
            break;
    }
}

// Is Cid Matched?
function isCidMatched(cid) {
    for (var i = 0; i < currentprojectdata.panoramas.length; i++) {
        for (var x = 0; x < currentprojectdata.panoramas[i].hotspots.length; x++) {
            if (currentprojectdata.panoramas[i].hotspots[x].hotspotid == cid) {
                return {pano: i, hot: x};
            }
        }
    }
    return false;
}

// Apply show title on hover or not
function applyshowtoh(cid) { // alert("Stoh: " + $("#showtitleonhover"+cid).val());
    var sthohval = parseInt($("#showtitleonhover" + cid).val());
    var res = isCidMatched(cid);
    if (sthohval == 1) 
        currentprojectdata.panoramas[res.pano].hotspots[res.hot].stoh = true;
     else 
        currentprojectdata.panoramas[res.pano].hotspots[res.hot].stoh = false;
     updateWtmFile();
}

// Show file chooser for hotspot
function changehotspoticon(cid) {
    showIconChooser(cid, "Choose a Hotspot Icon");
}

// For deleting an action
function removhaction(aindex, cid) {
    var res = isCidMatched(cid);
    currentprojectdata.panoramas[res.pano].hotspots[res.hot].actions.splice(aindex, 1);
    updateWtmFile();
    showeditorc("hotspots");
}

// Delete hotspot url
function removhurl(cid) {
    var res = isCidMatched(cid);
    currentprojectdata.panoramas[res.pano].hotspots[res.hot].url = undefined;
    updateWtmFile();
    showeditorc("hotspots");
}

// Delete hotspot url
function removhjs(cid) {
    var res = isCidMatched(cid);
    currentprojectdata.panoramas[res.pano].hotspots[res.hot].js = undefined;
    updateWtmFile();
    showeditorc("hotspots");
}

// Function for dynamically renaming hotspot title
function renameHotspotTitle(pidx, hidx) {
    tempstring = $("#hinput" + currentprojectdata.panoramas[pidx].hotspots[hidx].hotspotid).val();
    // console.log(tempstring);
    clearTimeout(tempTimeout);
    tempTimeout = setTimeout(function () {
        if (tempstring != "") {
            // console.log("Hotspot renamed to: " + tempstring);
            // console.log("pidx: " + pidx + ", hidx: " + hidx);
            currentprojectdata.panoramas[pidx].hotspots[hidx].title = tempstring;
            updateWtmFile();
            // generateHTMLPanoramas();
        }
    }, 1000);
}

// Adding new hotspot
function addNewHotspotFor(idx) {
    currentpanoramaindex = idx;
    var hotpath = __dirname + "/hotspotmaker.html";
    var panofile = currentprojectdata.panoramas[idx].panofile;
    var panoname = panofile.split(".")[0];
    // Let's copy current panorama file to temp panorama directory
    fse.copySync(wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + panofile, __dirname + "/temp/" + panofile);
    fs.readFile(hotpath, "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var newhtml = data.split("/*panoramas*/")[0] + "/*panoramas*/\n\r" + "var " + panoname + ' = new PANOLENS.ImagePanorama( "temp/' + panofile + '" );\n' + "viewer.add( " + panoname + " );\n" + panoname + ".addEventListener('progress', function(e){\n" + '$("#loading").show();\n' + "});\n" + panoname + ".addEventListener('load', function(e){\n" + '$("#loading").fadeOut();\n' + "});\n" + panoname + ".addEventListener('click', function(e){\n" + "});\n\r\n\r" + "\n\r/*panoramas-end*/" + data.split("/*panoramas-end*/")[1];
        fs.writeFile(hotpath, newhtml, function (err) {
            if (err) 
                return console.log(err);
            


            var hoteditor = new BrowserWindow({
                width: 1280,
                height: 720,
                title: i18next.t('hotspot'),
                icon: "icon.ico",
                webPreferences: {
                    nodeIntegration: true,
                    enableRemoteModule: true
                }
            });

            hoteditor.loadFile(hotpath);
            hoteditor.removeMenu();

          //  hoteditor.webContents.openDevTools();
        });
    });
}

// Removing Hotspot
function removehotspot(cid) {
    showYesNoAlert(i18next.t('removeHotspot'), i18next.t('areYouSureToRemoveHotspot'), function () {
        var cp = currentprojectdata.panoramas;
        for (var i = 0; i < cp.length; i++) {
            var cph = cp[i].hotspots;
            for (var x = 0; x < cph.length; x++) {
                if (cph[x].hotspotid == cid) {
                    currentprojectdata.panoramas[i].hotspots.splice(x, 1);
                    break;
                }
            }
        }
        updateWtmFile();
        showeditorc("hotspots");
    });
}

// Adding new image asset
function addImageasset() {
    pointToFile([
        "JPG", "jpg", "jpeg", "png"
    ], function () {
        showDim(i18next.t('addNewFile'));
        setTimeout(function () {
            tempDestinationDirectory = wtmdata.projects[currentprojectindex].projectdir + "/images/";
            addFile(function () {
                setTimeout(function () {
                    hideDim();
                    showeditorc("imageassets");
                }, 500);
            });
        }, 500);
    });
}

// Removing image asset
function removeImageasset(f) {
    showDim(i18next.t('deletingFile'));
    deleteFile(f);
    setTimeout(function () {
        hideDim();
        showeditorc("imageassets");
    }, 500);
}

// Adding new video file
function addVideofile() {
    pointToFile(["mp4"], function () {
        showDim(i18next.t('addNewFile'));
        setTimeout(function () {
            tempDestinationDirectory = wtmdata.projects[currentprojectindex].projectdir + "/videos/";
            addFile(function () {
                setTimeout(function () {
                    hideDim();
                    showeditorc("videos");
                }, 500);
            });
        }, 500);
    });
}

// Removing video file
function removeVideofile(f) {
    showDim(i18next.t('deletingFile'));
    deleteFile(f);
    setTimeout(function () {
        hideDim();
        showeditorc("videos");
    }, 500);
}

// Adding new audio file
function addAudiofile() {
    pointToFile(["mp3"], function () {
        showDim(i18next.t("addNewFile"));
        setTimeout(function () {
            tempDestinationDirectory = wtmdata.projects[currentprojectindex].projectdir + "/audios/";
            addFile(function () {
                setTimeout(function () {
                    hideDim();
                    showeditorc("audios");
                }, 500);
            });
        }, 500);
    });
}

// Removing audio file
function removeAudiofile(f) {
    showDim(i18next.t("deleteFileMessage"));
    deleteFile(f);
    setTimeout(function () {
        hideDim();
        showeditorc("audios");
    }, 500);
}

// Adding new pdf file
function addPdffile() {
    pointToFile(["pdf"], function () {
        showDim(i18next.t("addNewFile"));
        setTimeout(function () {
            tempDestinationDirectory = wtmdata.projects[currentprojectindex].projectdir + "/pdf/";
            addFile(function () {
                setTimeout(function () {
                    hideDim();
                    showeditorc("pdfs");
                }, 500);
            });
        }, 500);
    });
}

// Removing pdf file
function removePdffile(f) {
    showDim(i18next.t("deleteFileMessage"));
    deleteFile(f);
    setTimeout(function () {
        hideDim();
        showeditorc("pdfs");
    }, 500);
}

function setitasmainpano(idx) {
    currentprojectdata.settings.firstpanorama = currentprojectdata.panoramas[idx].panofile;
    updateWtmFile();
    console.log(i18next.t("homePanoramaSetMessage") + currentprojectdata.panoramas[idx].panofile);
    showeditorc("panoramas");
}


function saveProjectSettings() {
    showDim("A guardar o projeto...");
    var newtitle = $("#psloadingtext").val();
    var newdescription = $("#psdescription").val();
    var firstpanorama = $("#firstpanorama").val();
    var newcontrols = parseInt($("#pscontrols").val());
    currentprojectdata.settings = {
        loadingtext: newtitle,
        firstpanorama: firstpanorama,
        description: newdescription,
        controls: newcontrols
    };
    updateWtmFile();
    fs.readFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Update loading text
        var newhtml = data.split("<!--loadingtext-->")[0] + "<!--loadingtext-->" + newtitle + "<!--loadingtext-end-->" + data.split("<!--loadingtext-end-->")[1];

        // Update project title
        newhtml = newhtml.split("<!--projecttitle-->")[0] + "<!--projecttitle--><title>WAKWAKKKKKKKKK" + currentprojectdata.title + "</title><!--projecttitle-end-->" + newhtml.split("<!--projecttitle-end-->")[1];

        // Updating panoramas (no need, as it handled separately
        // newhtml = newhtml.split("/*panoramas*/")[0] +"/*panoramas*/\n\r"+ generatePanoramas(currentprojectdata.panoramas) +"\n\r/*panoramas-end*/"+ newhtml.split("/*panoramas-end*/")[1];

        // Update project description
        newhtml = newhtml.split("<!--projectdescription-->")[0] + '<!--projectdescription--><meta name="description" content="' + newdescription + '"><!--projectdescription-end-->' + newhtml.split("<!--projectdescription-end-->")[1];

        // Update panolens settings
        var cbsetting = "false";
        if (newcontrols == 1) 
            cbsetting = "true";
        


        newhtml = newhtml.split("/*panolens*/")[0] + "/*panolens*/\n\r" + "var viewer = new PANOLENS.Viewer( { container: container , controlBar: " + cbsetting + ",  output: 'console' , autoHideInfospot: false, } );" + "\n\r/*panolens-end*/" + newhtml.split("/*panolens-end*/")[1];

        fs.writeFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", newhtml, function (err) {
            if (err) 
                return console.log(err);
            


            showAlert(i18next.t("projectSettingsTitle"), i18next.t("settingsUpdatedMessage"));

        });
    });
}

function getPanoramasNameOption() {
    op = "";
    for (var i = 0; i < currentprojectdata.panoramas.length; i++) {
        var panname = currentprojectdata.panoramas[i].panofile;
        if (panname == currentprojectdata.settings.firstpanorama) 
            op += "<option selected='selected' value='" + panname + "'>" + panname + "</option>";
         else 
            op += "<option value='" + panname + "'>" + panname + "</option>";
        


    }
    return op;
}

function addpanorama() {
    var newpanoramapath = "";
    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["jpg", "jpeg", "png", "gif"]
            },
        ]
    }).then((result) => { // Get the new panorama file path
        newpanoramapath = result.filePaths[0];
        if (newpanoramapath != undefined) {
            console.log(newpanoramapath);
            // Renaming the file to better file name
            var newpanoramafile = newpanoramapath.split("\\")[newpanoramapath.split("\\").length - 1];
            newpanoramafile = remSpaces(newpanoramafile);
            // Checking duplicate file name to avoid conflicts
            if (foundduplicatepanofile(newpanoramafile)) 
                newpanoramafile = newpanoramafile.split(".")[0] + randomblah(5) + "." + newpanoramafile.split(".")[newpanoramafile.split(".").length - 1];
            


            console.log("Selected file: " + newpanoramafile);
            // Copying new panorama image to project image directory
            fse.copySync(newpanoramapath, wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + newpanoramafile);
            console.log("New panorama file copied to project directory.");
            // Pushing new panorama file name to projectdata
            currentprojectdata.panoramas.push({panofile: newpanoramafile, hotspots: []});
            // Write new projectdata to wtm file
            updateWtmFile();
            // Regenerate html panoramas
            // generateHTMLPanoramas();
            showDim(i18next.t("pleaseWait"));
            setTimeout(function () {
                showeditorc("panoramas");
                hideDim();
            }, 1000);
        }
    });
}

// Generating html for panorama changes
function generateHTMLPanoramas() {
    fs.readFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var newhtml = data.split("/*panoramas*/")[0] + "/*panoramas*/\n\r" + generatePanoramas(currentprojectdata.panoramas) + "\n\r/*panoramas-end*/" + data.split("/*panoramas-end*/")[1];

        // Update project title
        newhtml = newhtml.split("<!--projecttitle-->")[0] + "<!--projecttitle--><title>" + currentprojectdata.title + "</title><!--projecttitle-end-->" + newhtml.split("<!--projecttitle-end-->")[1];

        fs.writeFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", newhtml, function (err) {
            if (err) 
                return console.log(err);
            


            console.log("Done regenerating new HTML after adding new panorama.");
        });
    });
}

// To remove panorama
function removePanorama(idx) {
    showYesNoAlert(i18next.t("removePanoramaTitle"), i18next.t("removePanoramaMessage"), function () {
         {
            deleteFile(wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + currentprojectdata.panoramas[idx].panofile);
            currentprojectdata.panoramas.splice(idx, 1);
            updateWtmFile();
            showDim(i18next.t("pleaseWait"));
            setTimeout(function () {
                showeditorc("panoramas");
                hideDim();
            }, 1000);
        }
    });

}

var rnmttltimeout;
function renamecurrentproject() {
    var newtitle = $("#currentprojecttitle").val();
    if (newtitle.length > 3) {
        clearTimeout(rnmttltimeout);
        rnmttltimeout = setTimeout(function () { // Read existing WTM data
            fs.readFile(wtmdata.projects[currentprojectindex].projectdir + "/WTMProject.wtm", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var projectinfo = JSON.parse(data);
                projectinfo.title = newtitle;
                currentprojectdata.title = newtitle;
                // Then replace the WTM data with the updated one
                fs.writeFile(wtmdata.projects[currentprojectindex].projectdir + "/WTMProject.wtm", JSON.stringify(projectinfo), function (err) {
                    if (err) 
                        return console.log(err);
                    


                    // Then re-generate the HTML accordingly
                    // First read the existing HTML content
                    fs.readFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", "utf8", function (err, data) {
                        if (err) {
                            return false;
                        }
                        // Then manipulate and place the new content
                        var newhtml = data.split("<title>")[0] + "<title>" + newtitle + "</title>" + data.split("</title>")[1];
                        saveWtmdata();
                        setTimeout(function () {
                            fs.writeFile(wtmdata.projects[currentprojectindex].projectdir + "/index.html", newhtml, function (err) {
                                if (err) 
                                    return console.log(err);
                                


                                // If everything is done, save it!
                                wtmdata.projects[currentprojectindex].projectname = newtitle;
                                showAlert(i18next.t("projectTitle"), i18next.t("projectTitleUpdated"));
                            });
                        });
                    });
                });
            });
        }, 1000);
    }
}

// Remove spaces
function remSpaces(txt) { // txt.replace(/\s+/g, '').toLowerCase()
    txt = txt.replace(/-/g, "");
    txt = txt.replace(/\s+/g, "");
    if (isNumeric(txt)) {
        txt = "pano3sixty" + txt;
    }
    return txt;
}

// check if string is numeric
function isNumeric(str) {
    if (typeof str != "string") 
        return false;
    


    // we only process strings!
    return(!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str))); // ...and ensure strings of whitespace fail
}

// FILE SYSTEM FUNCTIONS//

// FS delete file
function deleteFile(f) {
    try {
        fs.unlinkSync(f);
        // file removed
    } catch (err) {
        console.error(err);
    }
}

// Showing open dialog file with callback
var tempSourceFile;
var tempDestinationFileName;
var tempDestinationDirectory;
function pointToFile(exts, fun) {
    doit = function () {
        fun();
    };

    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Supported Files",
                extensions: exts
            },
        ]
    }).then((result) => {
        tempSourceFile = result.filePaths[0];
        if (tempSourceFile != undefined) {
            tempDestinationFileName = remSpaces(tempSourceFile.split("\\")[tempSourceFile.split("\\").length - 1]);
            console.log("Chosen file: " + tempDestinationFileName);
            doit();
        } else {
            console.log("Open Dialog canceled.");
        }
    });
}

// Add file with callback
function addFile(fun) { // source file should be the tempSourceFile and destination shud be tempDestinationDirectory + tempDestinationFileName
    doit = function () {
        fun();
    };
    // Copy the file to the destination
    fse.copySync(tempSourceFile, tempDestinationDirectory + tempDestinationFileName);
    fun();
}

// A function to check is this file name is duplicated or not
function foundduplicatepanofile(filename) {
    for (var i = 0; i < currentprojectdata.panoramas.length; i++) {
        if (filename == currentprojectdata.panoramas[i].panofile) 
            return true;
        


    }
    return false;
}

// Update the WTM File of current project
function updateWtmFile() {
    fs.writeFile(wtmdata.projects[currentprojectindex].projectdir + "/WTMProject.wtm", JSON.stringify(currentprojectdata), function (err, data) {});
    // console.log("WTM File Updated.");
}

// messy click unclick menu
$(".subabitem").on("click", function () {
    setTimeout(function () {
        $(".dropdown-content", this).hide();
        topmenuclicked = false;
        $("#topmenudim").hide();
    }, 500);
});

var topmenuclicked = false;
$(".abitem").on("click", function () {
    $(".dropdown-content").hide();
    if (! topmenuclicked) {
        $(".dropdown-content", this).show();
        topmenuclicked = true;
        $("#topmenudim").show();
    } else {
        topmenuclicked = false;
        $("#topmenudim").hide();
    }
});

$("#topmenudim, .rightbtn").on("click", function () {
    $(".dropdown-content").hide();
    topmenuclicked = false;
    $("#topmenudim").hide();
    $(".abitem").css({"background-color": "inherit"});
});

$(".abitem").not(".rightbtn").hover(function () {
    $(".dropdown-content").hide();
    $(".abitem").css({"background-color": "inherit"});
    $(this).css({"background-color": "inherit"});
    if (topmenuclicked) {
        $(".dropdown-content", this).show();
    }
}, function () {
    if (! topmenuclicked) {
        $(".dropdown-content").hide();
        $(this).css({"background-color": "inherit"});
    }
});

$(".closebutton").hover(function () {
    $(this).css({"background-color": "inherit"});
}, function () {
    $(this).css({"background-color": "inherit"});
});

$(".minmaxbutton, .minimizebutton").hover(function () {
    $(this).css({"background-color": "inherit"});
}, function () {
    $(this).css({"background-color": "inherit"});
});

$(".page").on("click", function () {
    topmenuclicked = false;
});

showpage("projects");

$(document).ready(function () {
    $("body").fadeIn();

    console.log = function (txt) { // $("#debugwindowcontent").find("div").css({ "color" : "gray"});
        $("#debugwindowcontent").prepend("<div style='color: gray;'>" + txt + "</div>");
    };

    console.exception = console.error = console.debug = console.info = console.warn = console.log;

    $(function () {
        $("#debugwindow").draggable();
        $("#dimmessage").draggable();
    });

    ScanForPlugins();
});

function limitHeight() {
    $("#recentprojects").css({
        height: innerHeight - 75 + "px",
        overflow: "auto"
    });
    $("#editorcontent").css({
        height: innerHeight - 150 + "px"
    });
    $("#tutorials").css({
        height: innerHeight - 50 + "px"
    });
}

$(window).resize(function () {
    limitHeight();
});

// Hide Debug Window
function HideDebugWindow() {
    $("#debugwindow").hide();
}

// Hide Debug Window
function ShowDebugWindow() {
    $("#debugwindow").show();
    $("#debugwindow").css({
        top: innerHeight / 2 - $("#debugwindow").height() / 2,
        left: innerWidth / 2 - $("#debugwindow").width() / 2
    });
}

// Open Dev Console
function OpenDevConsole() {
    //app.webContents.openDevTools();
}

// Keyboard Shortcuts

$(window).keydown(function (e) {
    if (e.ctrlKey && e.which == 80) {
        showpage("projects");
    }
    if (e.ctrlKey && e.which == 79) {
        openproject();
    }
    if (e.ctrlKey && e.which == 81) {
        quitprogram();
    }

    if (e.ctrlKey && e.which == 84) {
        showpage("tutorials");
    }
    if (e.ctrlKey && e.which == 83) {
        showMiniPage("donate");
    }
    if (e.ctrlKey && e.which == 66) {
        showMiniPage("about");
    }
    if (e.ctrlKey && e.which == 68) {
        ShowDebugWindow();
    }
    if (e.ctrlKey && e.which == 85) {
        showpage("plugins");
    }
    if (e.ctrlKey && e.which == 82) {
        reloadApp();
    }

    e.preventDefault;
});

// Open link in external browser
const shell = require("electron").shell;
// assuming $ is jQuery
$(document).on("click", 'a[href^="http"]', function (event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

// Electron Bridge
ipcRenderer.on("setnewinfospotlocation", (event, arg) => {
    currentprojectdata.panoramas[currentpanoramaindex].hotspots.push({hotspotid: randomblah(10), title: arg.title, position: arg.position, actions: []});
    updateWtmFile();
    // generateHTMLPanoramas();
    showeditorc("hotspots");
});

// Overriding console.log
/*
var console = {};
console.error = function(msg){
    showAlert("Oh no... This is an Error!", "Select all the text below, press Ctrl+C on your keyboard to copy, and send it to habibieamrullah@gmail.com for fixing this error. Here is the error message:<br><br><br>" + msg);
};
console.log = function(msg){
    showAlert("Console Message", msg);
};
window.console = console;
*/

// Scan for plugins and initialize
function ScanForPlugins() {
    console.log("Current app path: " + apppath);

    fs.readdir(apppath + "\\plugins", function (err, files) { // handling error
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        // listing all files using forEach
        files.forEach(function (file) {
            var stats = fs.statSync(apppath + "\\plugins\\" + file);
            if (stats.isDirectory()) {
                console.log("Plugin directory found: " + file);

                fs.readFile(apppath + "\\plugins\\" + file + "\\plugininfo.txt", "utf8", function (err, data) {
                    if (err) {
                        console.log("Plugin " + file + " is invalid");
                        return;
                    }

                    var plugininfo = data.split("|");
                    var status = plugininfo[6];
                    var grayscale = "";

                    var enabledisablebutton = "<button class='greenbutton' onclick=\"DisablePlugin('" + file + "');\" style='margin: 0px;'><i class='fa fa-plug'></i> Disable Plugin</button>";
                    if (status == "status-disabled") {
                        enabledisablebutton = "<button onclick=\"EnablePlugin('" + file + "');\" style='margin: 0px; background-color: gray;'><i class='fa fa-plug'></i> Enable Plugin</button>";
                        grayscale = " filter: grayscale(100%);";
                    } else {
                        $("body").append("<script src='plugins/" + file + "/" + file + ".js'></script>");
                        console.log("Plugin " + file + " is enabled.");
                    }
                    $("#pluginlist").append("<div class='pluginbar'><div style='display: table; width: 100%;" + grayscale + "'><div style='display: table-cell; vertical-align: top; width: 80px;'><img src='plugins/" + file + "/thumbnail.png' style='width: 80px;'></div><div style='display: table-cell; vertical-align: top; padding-left: 1em;'><h2 style='margin: 0px;'>" + plugininfo[0] + "</h2><h5>Version " + plugininfo[1] + " | Requires 3Sixty Desktop Version " + plugininfo[2] + " | Developed by <a href='" + plugininfo[4] + "'>" + plugininfo[3] + "</a></h5><div>" + plugininfo[5] + "</div></div></div><div style='text-align: right;'>" + enabledisablebutton + "</div></div>");
                });
            }
        });
    });
}

// Enable Plugin
function EnablePlugin(p) {
    fs.readFile(apppath + "\\plugins\\" + p + "\\plugininfo.txt", "utf8", function (err, data) {
        if (err) {
            console.log("Plugin " + p + " is invalid");
            return;
        }

        data = data.replace("status-disabled", "status-enabled");

        fs.writeFile(apppath + "\\plugins\\" + p + "\\plugininfo.txt", data, function (err) {
            if (err) 
                return console.log(err);
            


            reloadApp();
        });
    });
}

// Disable Plugin
function DisablePlugin(p) {
    fs.readFile(apppath + "\\plugins\\" + p + "\\plugininfo.txt", "utf8", function (err, data) {
        if (err) {
            console.log("Plugin " + p + " is invalid");
            return;
        }

        data = data.replace("status-enabled", "status-disabled");

        fs.writeFile(apppath + "\\plugins\\" + p + "\\plugininfo.txt", data, function (err) {
            if (err) 
                return console.log(err);
            


            reloadApp();
        });
    });
}

// Reload Editor Hotspots
function ReloadEditorHotspots() {
    var panoswithhots = "";
    for (var i = 0; i < currentprojectdata.panoramas.length; i++) {
        var hotspotsofit = "";
        if (currentprojectdata.panoramas[i].hotspots.length == 0) {
            hotspotsofit = "<div>" + i18next.t("noHotspotForPanoramaMessage") + "</div>";
        } else {
            for (var x = 0; x < currentprojectdata.panoramas[i].hotspots.length; x++) {
                var cid = currentprojectdata.panoramas[i].hotspots[x].hotspotid;
                var hotspoticon = "/imgs/hotspot.png";

                if (currentprojectdata.panoramas[i].hotspots[x].icon != undefined) {
                    if (currentprojectdata.panoramas[i].hotspots[x].icon != "") 
                        hotspoticon = "/" + currentprojectdata.panoramas[i].hotspots[x].icon;
                    


                }

                var currenthActions = "<p>" + i18next.t("noAction") + "</p>";

                if (currentprojectdata.panoramas[i].hotspots[x].url != undefined || currentprojectdata.panoramas[i].hotspots[x].js != undefined) {
                    currenthActions = "<p>Actions:</p>";
                }

                if (currentprojectdata.panoramas[i].hotspots[x].url != undefined && currentprojectdata.panoramas[i].hotspots[x].url != "") {
                    hatype = "Open URL";
                    htarget = currentprojectdata.panoramas[i].hotspots[x].url;
                    currenthActions += "<div style='text-align: left;'><div style='font-style: italic; display: inline-block; background-color: black; color: white; padding: 5px; margin-top: 5px;'><i class='fa fa-arrow-circle-right'></i> " + hatype + "</div><div style='padding: 10px; border: 1px solid black;'><div> " + htarget + "</div><div style='color: gray; font-weight: bold; cursor: pointer; margin-top: 10px; display: inline-block;' onclick='removhurl(\"" + cid + "\");'><i class='fa fa-trash'></i> Remove</div></div></div>";
                }

                if (currentprojectdata.panoramas[i].hotspots[x].js != undefined && currentprojectdata.panoramas[i].hotspots[x].js != "") {
                    hatype = "Execute JavaScript";
                    htarget = "<span style='font-style: italic;'>Your JS Code...</span>";
                    currenthActions += "<div style='text-align: left;'><div style='font-style: italic; display: inline-block; background-color: black; color: white; padding: 5px; margin-top: 5px;'><i class='fa fa-arrow-circle-right'></i> " + hatype + "</div><div style='padding: 10px; border: 1px solid black;'><div> " + htarget + "</div><div style='color: gray; font-weight: bold; cursor: pointer; margin-top: 10px; display: inline-block;' onclick='removhjs(\"" + cid + "\");'><i class='fa fa-trash'></i> Remove</div></div></div>";
                }

                var hactions = currentprojectdata.panoramas[i].hotspots[x].actions;
                if (hactions.length > 0) {
                    currenthActions = i18next.t('title');
                    for (var y = 0; y < hactions.length; y++) {
                        var hatype;
                        var htarget = hactions[y].target.split("/")[1];

                        if (hactions[y].type == 0) {
                            hatype = i18next.t('openPanorama');
                        } else if (hactions[y].type == 1) {
                            hatype = i18next.t('showImage');
                        } else if (hactions[y].type == 2) {
                            hatype = i18next.t('playVideoFile');
                        } else if (hactions[y].type == 3) {
                            hatype = i18next.t('playAudioFile');
                        } else if (hactions[y].type == 4) {
                            hatype = i18next.t('showPDFFile');
                        }

                        currenthActions += "<div style='text-align: left;'><div style='font-style: italic; display: inline-block; background-color: black; color: white; padding: 5px; margin-top: 5px;'>" + hatype + "</div><div style='padding: 10px; border: 1px solid black;'><div> " + htarget + "</div><div style='color: gray; font-weight: bold; cursor: pointer; margin-top: 10px; display: inline-block;' onclick='removhaction(" + y + ', "' + cid + "\");'><i class='fa fa-trash'></i> Remove</div></div></div>";
                    }
                }

                var hiconidx = 0;
                if (currentprojectdata.panoramas[i].hotspots[x].icon != undefined) 
                    hiconidx = currentprojectdata.panoramas[i].hotspots[x].icon;
                


                hotspotsofit = "<div class='hotspotholder'><div class='hotspottitle'><input onkeyup=renameHotspotTitle(" + i + "," + x + ") id='hinput" + cid + "' value='" + i18next.t(currentprojectdata.panoramas[i].hotspots[x].title) + "'></div><div style='padding: 10px; white-space: normal; display: block; box-sizing: border-box;'><div id='hotscreen" + cid + "' style='display: none;'></div><div id='hothome" + cid + "'><div onclick='changehotspoticon(\"" + cid + "\");' style='width: 92px; height: 92px; margin: 0 auto; margin-top: 10px; margin-bottom: 10px; background: url(" + hotspotIcons[hiconidx].data + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover;'></div><div>" + currenthActions + "</div></div></div><div align='right'><button style='min-width: 20px;' class='greenbutton' onclick='hotShowAddNewAction(\"" + cid + "\")'><i class='fa fa-plus'></i> " + i18next.t('action') + "</button><button class='redbutton' style='min-width: 20px;' onclick=removehotspot('" + cid + "');><i class='fa fa-trash'></i> " + i18next.t('del') + "</button></div></div>" + hotspotsofit;
                // config button -> <button style='min-width: 20px;' onclick='hotShowConfigs(\""+cid+"\")'><i class='fa fa-cogs'></i> Conf.</button>
            }
        } hotspotsofit = "<div>" + hotspotsofit + "</div>";

        panoswithhots += "<div style='background: url(" + wtmdata.projects[currentprojectindex].projectdir + "/panoramas/" + currentprojectdata.panoramas[i].panofile + ") no-repeat center center; background-size: cover; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; margin-bottom: 20px; margin-right: 20px;'><div class='brighteronhover' style='padding: 20px;'><div style='border: 2px solid white; color: white; padding: 10px; display: inline-block; margin-bottom: 10px;'>" + currentprojectdata.panoramas[i].panofile + "</div><div style='overflow: auto; white-space: nowrap;'>" + hotspotsofit + "</div><button style='margin: 0px; margin-top: 10px;' class='greenbutton' onclick=addNewHotspotFor(" + i + ")><i class='fa fa-plus-square'></i> Novo Hotspot</button></div></div>";
    }
    $("#editorcontent").html("<h2>Hotspots</h2>" + panoswithhots);


}


const {translate} = require('./config-lang');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired.');
    translate();
});

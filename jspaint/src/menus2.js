/** @type {OSGUITopLevelMenus} */
var menus = {
	"&Gioco": [
		{
			label: "&Ridistribuisci",
			shortcutLabel: "F2",
			ariaKeyShortcuts: "F2",
			action: ()=> { resetGame(); },
			description: "Distribuisci una nuova partita",
		},
		// Non voglio dare l'impressione che si possa annullare mostrando questa opzione
		// {
		// 	label: "&Undo",
		// 	shortcutLabel: "",
		// 	ariaKeyShortcuts: "",
		// 	enabled: false,
		// 	action: ()=> { undo(); },
		// 	description: "Annulla l'ultima azione",
		// },
		{
			label: "Mazzo...",
			shortcutLabel: "",
			ariaKeyShortcuts: "",
			enabled: false,
			action: ()=> {},
			description: "Scegli un nuovo retro del mazzo",
		},
		{
			label: "&Opzioni...",
			shortcutLabel: "",
			ariaKeyShortcuts: "",
			enabled: false,
			action: ()=> {},
			description: "Cambia le opzioni di Solitario",
		},
		MENU_DIVIDER,
		{
			label: "E&sci",
			shortcutLabel: "",
			ariaKeyShortcuts: "",
			action: ()=> {
				close();
			},
			description: "Esci da Solitario",
		}
	],
	//"&Aiuto": [
		// {
		// 	label: "&Help Topics",
		// 	action: ()=> {
		// 		var show_help = window.show_help;
		// 		try {
		// 			show_help = parent.show_help;
		// 		} catch(e) {}
		// 		if (show_help === undefined) {
		// 			return alert("Gli argomenti della Guida funzionano solo all'interno del desktop di 98.js.org.");
		// 		}
		// 		show_help({
		// 			title: "Guida di Solitario",
		// 			contentsFile: "help/solitaire-help/solitaire.hhc",
		// 			root: "help/solitaire-help",
		// 		});
		// 	},
		// 	description: "Mostra la Guida per l'attività o il comando corrente.",
		// },
		// oppure in modo più dettagliato:
		// {
		// 	label: "&Contents",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Indice degli argomenti della guida di Solitario"
		// },
		// {
		// 	label: "&Search for Help on...",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Cerca nell'Engine della Guida un argomento specifico"
		// },
		// {
		// 	label: "&How to Use Help",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Guida all'utilizzo della Guida"
		// },
		// MENU_DIVIDER,
		//{
		//	label: "&Informazioni su Solitario...",
		//	action: ()=> {
				//window.open("https://github.com/1j01/98/tree/master/programs/js-solitaire");
		//	},
		//	description: "Informazioni su Solitario"
		//},
	//],
};

var go_outside_frame = false;
if(frameElement){
	try{
		if(parent.MenuBar){
			MenuBar = parent.MenuBar;
			go_outside_frame = true;
		}
	}catch(e){}
}
var menu_bar = new MenuBar(menus);
if (go_outside_frame) {
	frameElement.parentElement.insertBefore(menu_bar.element, frameElement);
} else {
	document.body.prepend(menu_bar.element);
}

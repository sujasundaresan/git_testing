/**
 * To show Staff List
 * 
 * @author Suja
 * added on 08/09/2012
 * @param element   - Root path
 */
function showStaffList(element,type,returnFn) {	
	var divId = element+'-Staff';
	if(type != null && type != ''){
		divId = divId+'-'+type;
	}
	new Ajax.Updater(divId, '../five/admin/staffList.jsf', {
	    parameters: { element: divId, returnFn:'fetchStaffDetailInEmergency',staffType:'',type : type}, evalScripts:true, onComplete:function(req) {
	    	$(divId + "-filter").value = "";
	    	$(divId).show();
	    	 
	    }
	});
}

/**
 * Displays the staff pop up from care plan wizard.
 * @param element
 * @return
 * @author Unni
 * @since v 0.0.116
 */
function showStaffListForCp(element) { 
	new Ajax.Updater(element + '-Staff', contextPath+'/five/admin/staffList.jsf', {
	    parameters: { 
	    	element: element + '-Staff', 
	    	returnFn:'setStaffInCarePlan',
	    	staffType:''
	    }, 
	    evalScripts:true, 
	    onComplete:function(req) {
	    	$(element + "-Staff-filter").value = "";
	    	$(element + '-Staff').show();
	    }
	});
}

/**
 * Sets the staff in the careplan wizard.
 * @param element
 * @return
 * @author Unni
 * @since v 0.0.116
 */
function setStaffInCarePlan(element, refPath, staffType, staffName, licNo, phone) {
	if(element.indexOf("plan")!= -1 || element.indexOf("physicianCertification")!= -1 || element.indexOf("pcsp")!=-1) {
		if ($("formIdValue")) {
			var menuPath = element.split('-Staff')[0];
			var root = menuPath.replace(/:/g , "").replace(/-/g , "");
		      
			if($(root+'assessor')){
		   		$(root+'assessor').innerHTML ="";
		    } 
			if($('assessor')){
		   		$('assessor').innerHTML ="";
		    }

			$(root+':eshStaffNameSpan').innerHTML = staffName ;
			$(root+':eshStaffName').value = staffName;
			$(root+':eshStaffId').value = refPath;
		}
	} else {
		var root = $(element.split("-Staff")[0]+"-elementLabelValue").value;
		$(root+':assessorNameLbl').innerHTML = staffName;
		$(root+':assessorName').value = staffName;
	  	$(root+':assessorLicenseNo').value = licNo;
		$(root+':licenseNumber').innerHTML=licNo;
	}
	$(element).hide();
}

/**
 * To show Nurse Care Manager Staff List
 * 
 * @author Suja
 * added on 08/10/2012
 * @param element   - Root path
 */
function showNurseCareManagerList(element) { 
	
	new Ajax.Updater(element + '-StaffNCM', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-StaffNCM', returnFn:'fetchNurseCareManagerDetailInEmergency',staffType:'Nurse Care Manager'}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-StaffNCM-filter").value = "";
	    	$(element + '-StaffNCM').show();
	    	 
	    }
	});
}

/**
 * To create Staff Grid
 * 
 * @author Suja
 * added on 08/09/2012
 * @param menuPath		- Root path
 * @param methodName	- Method to be called on the grid selection
 * @param staffType		- Staff type
 */
function createStaffGrid(menuPath, methodName, staffType, type) {
	var root = $(menuPath);
	var grid = $(menuPath + '-grid');
	
	// servlet url to fetch count and list of all staffs
	var ajaxUrl = "findStaffs.ajaxadm";
	var countUrl = "countStaffs.ajaxadm";
	// set the parameter values as Attributes
	if (root.getAttribute( 'gridOffset' ) == null || methodName != root.getAttribute('methodName') ) {
		root.setAttribute( 'gridOffset', grid.getAttribute( 'gridOffset'));
		root.setAttribute( 'gridSortCol', grid.getAttribute( 'gridSortCol'));
		root.setAttribute( 'gridSortDir', grid.getAttribute( 'gridSortDir'));
		root.setAttribute( 'filterStValue', "");
		root.setAttribute( 'menuPath', menuPath);
		root.setAttribute( 'element', menuPath);
		root.setAttribute( 'ajaxUrl', ajaxUrl);
		root.setAttribute( 'countUrl', countUrl);
		root.setAttribute( 'staffType', staffType);
		root.setAttribute( 'type', type);
		root.setAttribute( 'methodName', methodName);
	}
	
	// grid function
	liveGrids[menuPath] = new Rico.LiveGrid( menuPath + "-LG",
		1*grid.getAttribute('visibleRows'),
		1*grid.getAttribute('totalRows'),
		ajaxUrl,
		{	prefetchBuffer: true,
			tableClass: 'gridBody',
			loadingClass: 'gridLoading',
            scrollerBorderRight: '0px solid #FF0000',
			offset: 1*root.getAttribute('gridOffset'),
			sortCol: root.getAttribute('gridSortCol'),
			sortDir: root.getAttribute('gridSortDir'),
			largeBufferSize: 5.0,
			nearLimitFactor: 0.4,
			rootId: menuPath,
			onscroll : updateOffset,
			onRefreshComplete: updateSortInfo,
			requestParameters: [{name: 'element', value: root.getAttribute('element')},
								{name: 'filter', value: root.getAttribute('filterStValue')},
								{name: 'returnFn', value: root.getAttribute('methodName')},
								{name: 'staffType', value: root.getAttribute('staffType')},
								{name: 'type', value: root.getAttribute('type')},
								{name: 'path', value: root.getAttribute('menuPath')}],								
			sortAscendImg: '../images/sort_asc.gif',
			sortDescendImg:'../images/sort_desc.gif'
		});

	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)*2+'px';
	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)+'px';
	grid.style.border = '#999999 solid 1px';
	$(menuPath+"-filter").value = root.getAttribute('filterStValue');
	
	// function called on the filter text event
	//new Form.Element.Observer( $(menuPath+"-filter"), 1, function(element, val) {
		//checkStaffInput(val, menuPath);
	//} );
	if( $(menuPath).getAttribute('filterStValue') != null && $(menuPath).getAttribute('filterStValue') != "" ) {
		// calling the filter function, if there is a filter value
		filterStaffValueChange($(menuPath).getAttribute('filterStValue'), menuPath);
	}

	// Move Focus to Filter textbox.
	var filterBoxId = menuPath + "-filter";
	setFocus(filterBoxId );
	
	//reset the popup grid width after the grid is created
	if($(menuPath).className == "popupgrid"){
		$(menuPath).style.width = $(menuPath+"-grid").getWidth();
	}
}
/**
 * To check the Staff input value and call the filter function
 * 
 * @author Suja
 * added on 08/09/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function checkStaffInput(value, id ){
	// set the filter value in the Attribute
	$(id).setAttribute('filterStValue', value );
	// calling 'callFilterExportValueChange' function 
	setTimeout( "callFilterStaffValueChange('" + value + "', '" + id+  "')", 125);
}

/**
 * To call filter function on filter value change
 * 
 * @author Suja
 * added on 08/09/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function callFilterStaffValueChange(value, id){
	if( $( id + "-filter").value == value ){
		filterStaffValueChange(value, id);
	} else {
		$(id).setAttribute('filterStValue', $( id + "-filter").value );
	}
}

/**
 * Function called on the filter value change
 * 
 * @author Suja
 * added on 08/09/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function filterStaffValueChange(val, id) {
	var lg = liveGrids[id];
	var requestParams = new Array();
	$(id).setAttribute('filterStValue', val );
	// setting the parameters for grid functionality
	lg.setRequestParams( 
			{name: 'element', value: $(id).getAttribute('element')}, 
			{name: 'path', value: id}, 
			{name: 'filter', value: val}, 
			{name: 'returnFn', value: $(id).getAttribute('methodName')}, 
			{name: 'staffType', value: $(id).getAttribute('staffType')});
		// calling the servlet request to fetch staff count corresponding to the filter
	if (val) {
		var countMDAjax = new Ajax.Request(
			$(id).getAttribute('countUrl'),
			{
				method: 'get',
				parameters: 'element='+id+'&filter='+val+'&staffType='+$(id).getAttribute('staffType'),
				onSuccess: function(req) {countMDComplete( id, req );}
			});
	} else {
		$(id+"-foot").innerHTML = "" ;
		var grid = $(id+'-grid');
		lg.setTotalRows( 1*grid.getAttribute('totalRows') );
		lg.requestContentRefresh(0);
	}
}

/**
 * Function to fetch staff details for emergency wizard
 * 
 * @author Suja
 * added on 08/10/2012
 */
function fetchStaffDetailInEmergency(element, refPath, staffType, staffName, licNo, phone, type){
	$('eshNurseName'+type).value = staffName;
	$('eshNursePath'+type).value = refPath;
	$('eshNurseNameSpan'+type).innerHTML = staffName;
	if (staffName!=""){
		$('eshNurseNameClear'+type).show();
	}
	else{
		$('eshNurseNameClear'+type).hide();
	}
	if($('eshNurseNumber')){
		$('eshNurseNumber').value = phone;
		PhoneNumberUtil.changeValue('eshNurseNumber', phone);
	}	
	$(element).hide();
}

/**
 * Function to clear staff details for emergency wizard
 * 
 * @author Suja
 * added on 08/10/2012
 */
function clearEmergencyStaffValue(type){
	$('eshNurseName'+type).value = "";
	$('eshNursePath'+type).value = "";
	$('eshNurseNameSpan'+type).innerHTML = "";
	$('eshNurseNameClear'+type).hide();
	if($('eshNurseNumber')){
		$('eshNurseNumber').value = "";
		PhoneNumberUtil.changeValue('eshNurseNumber', $('eshNurseNumber').value);
	}	
}
/**
 * Function to fetch Nurse Care Manager details for emergency wizard
 * 
 * @author Suja
 * added on 08/10/2012
 */
function fetchNurseCareManagerDetailInEmergency(element, refPath, staffType, staffName, licNo, phone){
	var id = refPath.split(":")[1].split("-")[1];	
	$('eshManagerName').value = staffName;
	$('eshManagerPath').value = refPath;
	$('eshManagerNameSpan').innerHTML = staffName;
	
	if (staffName!=""){
		$('eshManagerNameClear').show();
	} else{
		$('eshManagerNameClear').hide();
	}
	
	new Ajax.Request(
			'ncmAddress.ajaxadm',
			{
				 method: 'get',
				 parameters:{ id: id
					},
					onComplete : function(request){
						var response = request.responseText.split("#");
						
						if (response == 'failure') {
							alert("failure");
						} else{
							$('eshManagerAddress').value = response[1];
						}
					}
			});
	
	$('eshManagerNumber').value = phone;
	PhoneNumberUtil.changeValue('eshManagerNumber', phone);
	$(element).hide();
}

/**
 * Function to clear Nurse Care Manager details for emergency wizard
 * 
 * @author Suja
 * added on 08/10/2012
 */
function clearEmergencyManagerValue(){
	$('eshManagerName').value = "";
	$('eshManagerPath').value = "";
	$('eshManagerNameSpan').innerHTML = "";
	$('eshManagerNameClear').hide();
	$('eshManagerAddress').value = "";
	$('eshManagerNumber').value = "";
	PhoneNumberUtil.changeValue('eshManagerNumber', $('eshManagerNumber').value);
}
function setStaffInMemberWizard(element, refPath, staffType, staffName, licNo,
		phone) {
	var instAjax = new Ajax.Request(
			'isAnAssignedStaff.auth',
			{
				method : 'get',
				parameters : 'element=' + element + '&name=' + staffName,
				onComplete : function(request) {
					if (request.responseText == "New") {
						var index = "";
						var rootForm = $("currentStaffCount");
						if (rootForm != null && rootForm.getAttribute("currentStaffIndex") != null) {
							index = rootForm.getAttribute("currentStaffIndex");
						}
						$('eshStaffNameSpan' + index).innerHTML = staffName;
						$('StaffName' + index).value = staffName;
						$('StaffType' + index).value = $('assignedStaffType'+ index).value;
						$('StaffReferencePath' + index).value = refPath;
						$('StaffNurseType' + index).value = $('assignedStaffType'+ index).value;
					} else if (request.responseText == "Old") {
						alert("\""+staffName+"\" is already Assigned.");
					}
					$(element).hide();

				}
			});
	
}
// Modified on 11/12/2014 for 2471 by Jitha
function setStaffInMemberCareTeamWizard(element, refPath, staffType, staffName, licNo,
		phone) {
	var elementLabel = element.replace(/:/g , "").replace(/-/g , "").replace("Staff","");
	var mrn = $(elementLabel+'mrn').value;
	var instAjax = new Ajax.Request(
			'isAnAssignedStaff.auth',
			{
				method : 'get',
				parameters : 'element=' + element + '&name=' + escape(staffName)+ '&mrn=' + mrn,
				onComplete : function(request) {
					if (request.responseText == "New") {
						var index = "";
						var rootForm = $("currentStaffCount");
						if (rootForm != null && rootForm.getAttribute("currentStaffIndex") != null) {
							index = rootForm.getAttribute("currentStaffIndex");
						}
						$(elementLabel+'eshStaffNameSpan' + index).innerHTML = staffName;
						$(elementLabel+'StaffName' + index).value = staffName;
						$(elementLabel+'StaffType' + index).value = $(elementLabel+'assignedStaffType'+ index).value;
						$(elementLabel+'StaffReferencePath' + index).value = refPath;
						$(elementLabel+'StaffNurseType' + index).value = $(elementLabel+'assignedStaffType'+ index).value;
					} else if (request.responseText == "Old") {
						alert("\""+escape(staffName)+"\" is already Assigned.");
					}
					$(element).hide();

				}
			});
}

function showStaffListForMemberWizard(element, formId, index) { 
	if(element.indexOf("careTeam") != -1){
		new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
		    parameters: { element: element + '-Staff', returnFn:'setStaffInMemberCareTeamWizard', staffType:''}, evalScripts:true, onComplete:function(req) {
		    	$(element + "-Staff-filter").value = "";
		    	$(element + '-Staff').show();
		        $(element + '-Staff-widget').style.top = "100px";
		        $(element + '-Staff-widget').style.left = "600px";
		    }
		});
	} else {
		new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
	    	parameters: { element: element + '-Staff', returnFn:'setStaffInMemberWizard', staffType:''}, evalScripts:true, onComplete:function(req) {
	    		$(element + "-Staff-filter").value = "";
	    		$(element + '-Staff').show();
	        	$(element + '-Staff-widget').style.top = "1500px";
	        	$(element + '-Staff-widget').style.left = "365px";
	    	}
		});
	}
	var rootForm = $("currentStaffCount");
    rootForm.setAttribute("currentStaffIndex", index);
}
function setStaffRole(root,index){
	if(root.indexOf("careTeam") != -1){
	    $(root+'StaffType'+index).value = $(root+'assignedStaffType'+index).value;
        $(root+'StaffNurseType'+index).value = $(root+'assignedStaffType'+index).value;
	} else {
		 $('StaffType'+index).value = $('assignedStaffType'+index).value;
	     $('StaffNurseType'+index).value = $('assignedStaffType'+index).value;
	}
}
function showStaffRoles(path) {
	if(path.indexOf("careteamRoles") != -1) {
	    new Ajax.Updater('showStaffRoles-widget','../wizard/manageStaffRoleInAdmin.jsf', {
	         parameters:{ element: path }, onComplete:function(req) {
	                    $('showStaffRoles-widget').show();
	                    $('addNewRole').show();
	                    wizHideAjaxLoader();
	                    wizShowAjaxPopup("showStaffRoles-widget", "Staff Role");
	        	 		$('popup_showStaffRoles-widget').style.width = "530px";
	        	 		$('popup_showStaffRoles-widget').style.left = "421px";
	        	 		$('showStaffRoles-widget').style.width = "500px";
	        	 		$('popup_showStaffRoles-widget_content').style.width = "515px";
	           }
	    });
	} else {
		 new Ajax.Updater('showStaffRoles-widget','../wizard/manageStaffRole.jsf', {
	         parameters:{ element: path }, onComplete:function(req) {
	                    $('showStaffRoles-widget').show();
	                    $('addNewRole').show();
	                    wizHideAjaxLoader();
	                    wizShowAjaxPopup("showStaffRoles-widget", "Staff Role");
	        	 		$('popup_showStaffRoles-widget').style.width = "530px";
	        	 		$('popup_showStaffRoles-widget').style.left = "421px";
	        	 		$('showStaffRoles-widget').style.width = "500px";
	        	 		$('popup_showStaffRoles-widget_content').style.width = "515px";
	           }
	    });
	}
}
function createRole(path,event){
	var staffRole = trim($('roleName').value);
	var staffCode = trim($('staffCode').value);
    if (staffRole!=null && staffRole!="" && staffCode!=null && staffCode!="") {
		if (!duplicateStaffRole(staffRole,staffCode)) {
			return false;
		}
		wizShowAjaxLoader();
		var instAjax = new Ajax.Request('createStaffRole.auth',
				{
					method : 'get',
					parameters : 'staffRole=' + staffRole+'&staffCode='+staffCode,
					onComplete : function(request) {
						
						$('errRoleName').innerHTML = "Staff Role is Created ...";
						fade('errRoleName');
						setTimeout("closeStaffRole('" + path + "','" + event+ "');", 100);
						if(path.indexOf("serviceOrder")!=-1) {
							showApproverRolesInServiceOrder(path);
						} else if (path.indexOf("careteamRoles")!=-1){
							showCareTeamRolesList(path);
						} else if (path.indexOf("identity:careTeam")!=-1){
							showAssignStaffInCare(path);
						}
					}
				});
		
	} else { 
		if (staffRole== null || staffRole == ""){
				$('errRoleName').innerHTML ="Enter Staff Role.";
				fade('errRoleName'); 
		}
		else if (staffCode == null || staffCode == "") {
			 $('errRoleName').innerHTML = "Enter Staff Code. "
			 fade('errRoleName');
		}               
 	}
    wizHideAjaxLoader();
}
displayRoleDiv=function(id,rowId) {
    $('role'+rowId).hide();
    $('roleTxt'+rowId).show();
 return;
}
closeStaffRole=function(element,event) {
    $('showStaffRoles-widget').hide();
    wizHideAjaxPopup("showStaffRoles-widget", event);
    
    if(element.indexOf("careTeam") != -1){
    	new Ajax.Updater(element+'-assignStaffDivCare','../wizard/assignStaffTemplate.jsf',{
    		parameters:{element:element},evalScripts:true,onComplete:function(req){
    			wizHideAjaxLoader();	
    		}
    	});
    } else {
    	new Ajax.Updater('assignStaffDiv','../wizard/assignStaffTemplate.jsf',{
    		parameters:{element:element},evalScripts:true,onComplete:function(req){
    			wizHideAjaxLoader();		
    		}
    	});
   }
}
duplicateStaffRole=function(staffRole,code){	
	var i=0;
	
	while($('role'+i)!=null){
		if($('role'+i).innerHTML == staffRole ||$('role'+i).innerHTML == staffRole.toCamelCase() || $('role'+i).innerHTML == staffRole.capitalize()){
			$('errRoleName').innerHTML="Staff Role already exists...";
			fade('errRoleName');
			return false;
		}
		i++;
	}
   var j=0;
	while($('code'+j)!=null){
		if($('code'+j).innerHTML == code ||$('code'+j).innerHTML == code.toCamelCase() || $('code'+j).innerHTML == code.capitalize()){  
			$('errRoleName').innerHTML="Staff Code already exists...";
			fade('errRoleName');
			return false;
		}
		j++;
	}

	return true;
}
updateStaffRole = function(id, rowId, path, code) {
	var roleId = id;
	var roleName = trim($('roleName' + rowId).value);

	if (roleName != null && roleName != '') {
		wizShowAjaxLoader();
		var instAjax = new Ajax.Request('updateStaffRole.auth',{
					method : 'get',
					parameters : 'id=' + roleId + '&roleName=' + roleName+ '&roleCode=' + code,
					onComplete : function(request) {
						var response = request.responseText;
						$('roleTxt' + rowId).style.display = "none";
						if (request.responseText == "Ok") {
							new Ajax.Updater('showStaffRoles-widget','../wizard/manageStaffRole.jsf',{
										parameters : {element : path},
										onComplete : function(req) {
											$('roleListDiv').style.display = "none";
											$('showAllRolelink').style.display = "none";
											$('roleListDiv').style.display = "block";
											$('addNewRolelink').style.display = "block";
											if (path.indexOf("identity:careTeam")!=-1){
												showAssignStaffInCare(path);
											}
											wizHideAjaxLoader();
										}
									});
						} else if (request.responseText == "Not"
								|| request.responseText == "Exception") {
							$('role' + rowId).style.display = "block";
							$('roleTxt' + rowId).style.display = "none";
							wizHideAjaxLoader();
							alert("Referral Source not updated. Try again.");
						} else if (request.responseText == "Already Exists") {
							$('role' + rowId).style.display = "block";
							$('roleTxt' + rowId).style.display = "none";
							wizHideAjaxLoader();
							alert("Referral Source not updated, since Source already exists.");
						} else {
							$('role' + rowId).style.display = "block";
							$('roleTxt' + rowId).style.display = "none";
							wizHideAjaxLoader();
						}
					}
				});
	} else {
		alert("Enter Referral Source Name.");
	}
}
hasHeightWeightStatus=function(path) {
	var instAjax = new Ajax.Request(
	           'updateTrimWithStatus.ajaxcp', {
	               method: 'get', 
	               parameters: 'element='+path, 
	               onComplete: function(request) {
	                   
	               }
	       });	
}
clearStaffData = function(menuLabel){
	if(menuLabel.indexOf('careTeam')>-1){
		$(menuLabel+'eshStaffNameSpan').innerHTML = "";
		$('Fieldques'+menuLabel+'assignedDate').value = "";
	} else {
		$('eshStaffNameSpan').innerHTML = "";
		$('FieldquesassignedDate').value = "";
	}
	
}

/**
 * For staff assignment process 
 * 
 * @author Suja
 * added on 09/28/2012
 */
function assignMembersToStaffs(element, label) {
	if (validateStaffAssignment()==true){
		$('assignMemberStaff').setAttribute("disabled","");
		$(element+"-msg").innerHTML = "Staff assignment is started in background for valid MRNs....";
		var instAjax = new Ajax.Request('assignStaff.ajaxcteam', {
			method : 'get',
			parameters : { 
							role: $('ctRole').value,
							staff: $('ctStaffRefPath').value,
							assignDate: $('FieldquesctAssignedDate').value,
							members: $('ctMembers').value
						  },
			onComplete : function(req) {		
				setTimeout("clearStaffAssignmentValues('" + element + "');",3500);
			}
		});
	}
}

/**
 * To populate staff popup on staff assignment widget
 * 
 * @author Suja
 * added on 10/02/2012
 */
function showStaffListForStaffAssignment(element, formId) { 
	new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-Staff', returnFn:'setStaffInStaffAssignment', staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-Staff-filter").value = "";
	    	$(element + '-Staff').show();
	    }
	});
}

/**
 * To display staff on staff assignment widget
 * 
 * @author Suja
 * added on 10/02/2012
 */
function setStaffInStaffAssignment(element, refPath, staffType, staffName, licNo, phone) {
	$('ctStaffLabel').innerHTML = staffName;
	$('ctStaff').value = staffName;
	$('ctStaffRefPath').value = refPath;
	$(element).hide();
}

/**
 * Display name in the format lastName, FirstName Middlename
 *
 *@author Jitha
 */
function setNameInFormat(fullName, root) {
	var arr = fullName.split(' ');
	var formattedName = "";
	if(arr.length == 3){
		formattedName = arr[2]+", "+arr[0]+" "+arr[1];
	}else if(arr.length == 2){
		formattedName = arr[1]+", "+arr[0];	 
	}else if(arr.length == 1){
		formattedName = arr[0];
	}else if(3<arr.length){
		formattedName = arr[arr.length-1]+",";	
	    for (i = 0; i < arr.length-1; i++)
	      {	formattedName += " "+arr[i]; }
	 }
	$(root+"nameFormat").innerHTML = formattedName;	
}
/**
 * To set Bmi Value in CarePlan Wizard
 *
 *@author Jitha
 */
function setBMIValue(root){
    $(root+":weightInKg").value="";
    $(root+":heightInCm").value="";
    $(root+":bmi").value=""
    var weight=$(root+":weight").value ;
	var heightinch=$(root+":heightinch").value ;
	var heightfeet=$(root+":heightfeet").value ;
	var unit=$(root+":weightunit").value;
    if(heightfeet.trim()=="") heightfeet='0';
    if(heightinch.trim()=="") heightinch='0';
	if(!isNaN(heightfeet.trim())&&!isNaN(heightinch.trim())&&!isNaN(weight.trim())&&(heightfeet.trim()!="" || heightinch.trim()!="") && weight.trim()!="" && (1<=heightfeet || 0<heightinch )&& 0<weight && heightinch<12){ 
	   var heightInInch=parseInt(heightfeet*12)+parseInt(heightinch);
       var heightInMeter=0.0254 *heightInInch;                               
	   if(unit.indexOf('Weight in pounds')!= -1) weight=weight*0.45359237;
	   var roundedBmi = Math.round(weight/(heightInMeter*heightInMeter)*100)/100;
	   $(root+":bmi").value=roundedBmi ;
	   $(root+":bmi").readOnly=true ;
       $(root+":weightInKg").value=Math.round(weight) ;
       $(root+":heightInCm").value=Math.round(heightInMeter*100); 
    } else {
	   $(root+":bmi").value="" ;
	}
}
/**
 * To checkNull value of height and weight in Careplan Wizard
 *
 *@author Jitha
 */
function checkNull(id,value){
     if(value=="") $(id).value="0";
     if( value.substring(0,1) == "0" &&  1<=value.length ) $(id).value = value.substring(1,value.length);
}
/**
 * To set status of height and weight in careplan wizard
 *
 *@author Jitha
 */
function setStatus(value,root,id){
	if(value=="new"){
		if(id.indexOf('weight') != -1){
			$(root+":weight").value="0";
			$(root+":weightunit").value="CE|D1298635|2.16.840.1.113883.6.56||2007AA|Weight in pounds";
			setBMIValue(root);
		} else {
			$(root+":heightinch").value="0";
			$(root+":heightfeet").value="0";
			setBMIValue(root);
		}
	}
}
/**
 * To set height, weight and Bmi in careplan wizard
 *
 *@author Jitha
 */
function setWeightHeightBmi(root){
	changeWeight(root);
    changeHeight(root);
	var bmiValue=$(root+":bmi").value;
	if(bmiValue.trim()!=null){
		$(root+":bmi").readOnly=true ;							
	}
	var ehLength= $(root+":eheight").options.length;
	var ewLength= $(root+":eweight").options.length;
	if($(root+":eheight").options.length == 1){
		$("eh").style.display = 'none';
	} else {
		$(root+":eheight").value = $(root+":heightfeet").value+'\''+$(root+":heightinch").value+'"';
		$(root+":heightfeet").readOnly = true;
		$(root+":heightinch").readOnly = true;
		if($(root+":eheight").value == "new"){
			$(root+":heightfeet").readOnly = false;
			$(root+":heightinch").readOnly = false;
		}
	}
	if($(root+":eweight").options.length == 1){
		$("ew").style.display = 'none';
	} else {
		var weightUnit	= "#{dmeAct.relationship['weight'].act.observation.values[0].CE}";
		wUnit = $("weightUnitSpan").innerHTML;
       weightValue=$(root+":weight").value+".0~"+wUnit;
       $(root+":eweight").value = weightValue;
        if($(root+":eweight").value == "new"){
			$(root+":weight").readOnly = false;
			$("uw").style.display	= "block";
		} else{						
		$(root+":weight").readOnly = true;
		$("uw").style.display	= "none";
		$("weightUnitSpan").style.display	= "block";
                            
       }      
	}
	setBMIValue(root);
}

/**
 * To populate current date on assign date in staff assignment widget
 * 
 * @author Suja
 * added on 10/04/2012
 */
function setCurrentDateToAssignmentDate(){
	if($('FieldquesctAssignedDate')){
		var currentTime = new Date();
		var month = currentTime.getMonth() + 1;
		if(month < 10){
			month = '0'+ month;
		}
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		$('FieldquesctAssignedDate').value = month + "/" + day + "/" + year;
	}
}

/**
 * Validation on staff assignment widget
 * 
 * @author Suja
 * added on 10/04/2012
 */
function validateStaffAssignment(){
	var flag = true;
	$('ctRoleErrMsg').innerHTML = "*";
	$('ctStaffErrMsg').innerHTML = "*";
	$('ctAssignedDateErrMsg').innerHTML = "*";
	$('ctMembersErrMsg').innerHTML = "*";
	if ($('ctRole').value==""){
		$('ctRoleErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('ctStaffRefPath').value==""){
		$('ctStaffErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('FieldquesctAssignedDate').value==""){
		$('ctAssignedDateErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('ctMembers').value==""){
		$('ctMembersErrMsg').innerHTML = "*Required";
		flag = false;
	}
	else{
		var reg = new RegExp(/^[0-9,]*$/);
		if (reg.test($('ctMembers').value) ==false){
			$('ctMembersErrMsg').innerHTML = "*Please enter valid MRN's";
			flag = false;
		}
	}
	return flag;
}
/**
 * To clear values
 * 
 * @author Suja
 * added on 10/04/2012
 */
function clearStaffAssignmentValues(element){
	$('ctRoleErrMsg').innerHTML = "*";
	$('ctStaffErrMsg').innerHTML = "*";
	$('ctAssignedDateErrMsg').innerHTML = "*";
	$('ctMembersErrMsg').innerHTML = "*";
	$('ctRole').value="";
	$('ctStaff').value="";
	$('ctStaffRefPath').value="";
	$('ctStaffLabel').innerHTML="";
	$('ctMembers').value="";
	$('assignMemberStaff').removeAttribute("disabled");
	$(element+"-msg").innerHTML = "";
	setCurrentDateToAssignmentDate();
}
/**
 * To show Auth New popup
 * 
 * @author Suja
 * added on 10/15/2012
 */
function showAuthNewPopup(element){
	wizShowAjaxLoader();
	new Ajax.Updater(element + '-widget', '../five/authorization/authNew.jsf', {
	    parameters: { element: element }, evalScripts:true, onComplete:function(req) {
	    	wizHideAjaxLoader();
	    	$(element + '-widget').show();
	    	wizShowAjaxPopup(element + '-widget', "New Authorization Wizard");
	    }
	});
}
/**
 * To open Auth wizard
 * 
 * @author Suja
 * added on 10/15/2012
 * Modified to Fix the element Change
 */
function openAuthWizard(event){
	$('errMemberMRN').innerHTML="*";
	if ($('memberMRN').value==""){
		$('errMemberMRN').innerHTML="* required";
		return;
	}
	new Ajax.Request(
	           'fetchMemeberMenuDataId.ajaxlt', {
	               method: 'get', 
	               parameters: 'mrn='+$('memberMRN').value, 
	               onComplete: function(req) {
	                   if (req.responseText!=""){
	                	   showPane('echr:patient-' + req.responseText + ':authorization:' + $('authWizard').value,false,
	                			   'echr:patient-' + req.responseText + ':authorization:' + $('authWizard').value);
	                	   setTimeout("showAuth("+req.responseText + ",'" + $('authWizard').value + "');",1500);
	                	   wizHideAjaxPopup('echr:authorization:pending-widget', event);
	                   }
	                   else{
	                	   $('warInvalidMember').innerHTML="Invalid Member MRN";
	                	   TimeToFade = 1200.0;
	                	   fade('warInvalidMember');
	                   }
	               }
	       });
}
/**
 * To open selected Auth wizard for the selected member
 * 
 * @author Suja
 * added on 10/15/2012
 */
function showAuth(menudataId, wizard){
	showActionOptions('echr:patient-' + menudataId + ':authorization:' + wizard + ':menu_dropdown_loc',
			'echr:patient-' + menudataId + ':authorization:' + wizard + ':menu_drpDwn');
}

/**
 * To load Staff List in aide requests
 * added on 15/10/2012
 * @param element   - Root path
 */

function showStaffListForAidRequest(root) {

	var element = root;
	new Ajax.Updater(root + '-AidRequestStaff', '../five/admin/staffList.jsf', { 
	    parameters: { element: root + '-AidRequestStaff', returnFn:'setStaffInAidRequest',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(root + "-AidRequestStaff-filter").value = "";
	    	$(root + '-AidRequestStaff').show();
	    	$(root + '-AidRequestStaff-widget').style.top = "1800px";
            $(root + '-AidRequestStaff-widget').style.left = "365px";
	    }
	});
}

function setStaffInAidRequest(element, refPath, staffType, staffName, licNo, phone) {
	var root = element.replace(":","").replace(":","").replace("-","").replace("-","").replace("-","").replace('AidRequestStaff','');
	if(root.indexOf("two") != -1){
		var idApp = root.replace('two','');
		$(idApp+':twoeshAidStaffNameSpan').innerHTML = staffName;
		$(idApp+':twonurseName').value = staffName;
		$(element).hide();
	}else{
		$(root+':eshAidStaffNameSpan').innerHTML = staffName;
		$(root+':nurseName').value = staffName;
		$(element).hide();
}
}

/**
 * To load Staff List in  transport wizard
 * added on 15/10/2012
 * @param element   - Root path
 */

function showStaffListForTransPort(element) {
	new Ajax.Updater(element + '-TransportStaffList', '../five/admin/staffList.jsf', { 
	    parameters: { element: element + '-TransportStaffList', returnFn:'setStaffInTransPort',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-TransportStaffList-filter").value = "";
	    	$(element + '-TransportStaffList').show();
	    	$(element + '-TransportStaffList-widget').style.top = "350px";
            $(element + '-TransportStaffList-widget').style.left = "365px";
	    }
	});
}


/**
 * To load Staff List in  service wizard
 * added on 15/10/2012
 * @param element   - Root path
 */

function showStaffListForService(element) {
	new Ajax.Updater(element + '-TransportStaffList', '../five/admin/staffList.jsf', { 
	    parameters: { element: element + '-TransportStaffList', returnFn:'setStaffInService',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-TransportStaffList-filter").value = "";
	    	$(element + '-TransportStaffList').show();
	    	$(element + '-TransportStaffList-widget').style.top = "350px";
            $(element + '-TransportStaffList-widget').style.left = "365px";
	    }
	});
}



/**
 * To load Staff List in  order service wizard
 * added on 15/10/2012
 * @param element   - Root path
 */

function showStaffListForTransPort(element) {
	new Ajax.Updater(element + '-TransportStaffList', '../five/admin/staffList.jsf', { 
	    parameters: { element: element + '-TransportStaffList', returnFn:'setStaffInTransPort',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-TransportStaffList-filter").value = "";
	    	$(element + '-TransportStaffList').show();
	    	$(element + '-TransportStaffList-widget').style.top = "350px";
            $(element + '-TransportStaffList-widget').style.left = "365px";
	    }
	});
}

function setStaffInTransPort(element, refPath, staffType, staffName, licNo, phone) {
 var root = element.replace(":","").replace(":","").replace("-","").replace("-","").replace("-","").replace('TransportStaffList','');
 $(root+':eshTransPortStaffNameSpan').innerHTML = staffName;
 $(root+':eshTransPortStaffNameSpan').value = staffName;
 if (staffName != "") {
	  $(root+':trs_contacts').value = staffName;
		if(phone != "") {
			$(root+':trs_phoneno').value = phone;
		} else {
			$(root+':trs_mltcContact')!= null ? $(root+':trs_phoneno').value = $(root+':trs_mltcContact').value :$(root+':trs_phoneno').value = "";
		}
	} else {
		$(root+':trs_contacts').value = "";
		$(root+':trs_mltcContact')!= null ? $(root+':trs_phoneno').value = $(root+':trs_mltcContact').value :$(root+':trs_phoneno').value = "";
	}
	$(element).hide();
}


function setStaffInService(element, refPath, staffType, staffName, licNo, phone) {
	 var root = element.replace(":","").replace(":","").replace("-","").replace("-","").replace("-","").replace('TransportStaffList','');
	 $(root+':eshStaffNameSpan').innerHTML = staffName;
	 $(root+':eshStaffNameSpan').value = staffName;
	 if (staffName != "") {
		  $(root+':trs_contacts').value = staffName;
			if(phone != "") {
				$(root+':trs_phoneno').value = phone;
			} else {
				$(root+':trs_mltcContact')!= null ? $(root+':trs_phoneno').value = $(root+':trs_mltcContact').value :$(root+':trs_phoneno').value = "";
			}
		} else {
			$(root+':trs_contacts').value = "";
			$(root+':trs_mltcContact')!= null ? $(root+':trs_phoneno').value = $(root+':trs_mltcContact').value :$(root+':trs_phoneno').value = "";
		}
		$(element).hide();
	}
/**
 * Function to show Referring Organization
 * 
 * added on 10/22/2012
 * @author Shain Raj
 * @param element
 * @param elementLabel
 * @return
 */
function showReferringOrganization(element, elementLabel) {
	new Ajax.Updater(element + '-refOrgPop', '../five/patient/organizationList.jsf', { 
	    parameters: { element: element + '-refOrgPop', returnFn:'getReffOrgContacts', ele:element, elelbl:elementLabel}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-refOrgPop-filter").value = "";
	    	$(element + '-refOrgPop').show();
	    	if(element.indexOf("intakeStat") != -1) {
	    		$(element + '-refOrgPop-widget').style.top = "200px";
	    	} else if(element.indexOf("echr:patients:wip") != -1){
	    		var y =  getOffset($(elementLabel+'refOrgSpanValue')).top*1-300;
	    		$(element + '-refOrgPop-widget').style.top = y+"px";
	    	}	
	    	else {
	    		$(element + '-refOrgPop-widget').style.top = "1200px";
	    	}
            $(element + '-refOrgPop-widget').style.left = "400px";
	    }
	});
}

/**
 * Function to create Referring Organization Grid
 * 
 * added on 10/22/2012
 * @author Shain Raj
 * @param menuPath
 * @param ele
 * @param elelbl
 * @param methodName
 * @return
 */
function createRefOrganizationGrid(menuPath, ele, elelbl, methodName) {
	var root = $(menuPath);
	var grid = $(menuPath + '-grid');
	
	var ajaxUrl = "findRefOrganizations.ajaxlt";
	var countUrl = "countRefOrganizations.ajaxlt";
	
	if (root.getAttribute( 'gridOffset' ) == null) {
		root.setAttribute( 'gridOffset', grid.getAttribute( 'gridOffset'));
		root.setAttribute( 'gridSortCol', grid.getAttribute( 'gridSortCol'));
		root.setAttribute( 'gridSortDir', grid.getAttribute( 'gridSortDir'));
		root.setAttribute( 'filterStValue', "");
		root.setAttribute( 'menuPath', menuPath);
		root.setAttribute( 'element', ele);
		root.setAttribute( 'elementLabel', elelbl);
		root.setAttribute( 'methodName', methodName);
		root.setAttribute( 'ajaxUrl', ajaxUrl);
		root.setAttribute( 'countUrl', countUrl);
	}
	
	liveGrids[menuPath] = new Rico.LiveGrid( menuPath + "-LG",
		1*grid.getAttribute('visibleRows'),
		1*grid.getAttribute('totalRows'),
		ajaxUrl,
		{	prefetchBuffer: true,
			tableClass: 'gridBody',
			loadingClass: 'gridLoading',
            scrollerBorderRight: '0px solid #FF0000',
			offset: 1*root.getAttribute('gridOffset'),
			sortCol: root.getAttribute('gridSortCol'),
			sortDir: root.getAttribute('gridSortDir'),
			largeBufferSize: 5.0,
			nearLimitFactor: 0.4,
			rootId: menuPath,
			onscroll : updateOffset,
			onRefreshComplete: updateSortInfo,
			requestParameters: [{name: 'element', value: root.getAttribute('element')},
								{name: 'filter', value: root.getAttribute('filterStValue')},
								{name: 'returnFn', value: root.getAttribute('methodName')},
								{name: 'elementLabel', value: root.getAttribute('elementLabel')},
								{name: 'path', value: root.getAttribute('menuPath')}],
			sortAscendImg: '../images/sort_asc.gif',
			sortDescendImg:'../images/sort_desc.gif'
		});

	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)*2+'px';
	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)+'px';
	grid.style.border = '#999999 solid 1px';
	$(menuPath+"-filter").value = root.getAttribute('filterStValue');
	
	/*new Form.Element.Observer( $(menuPath+"-filter"), 1, function(element, val) {
		checkRefOrgInput(val, menuPath, elelbl);
	} );*/
	if( $(menuPath).getAttribute('filterStValue') != null && $(menuPath).getAttribute('filterStValue') != "" ) {
		filterRefOrgValueChange($(menuPath).getAttribute('filterStValue'), menuPath, elelbl);
	}

	var filterBoxId = menuPath + "-filter";
	setFocus(filterBoxId );
	
	if($(menuPath).className == "popupgrid"){
		$(menuPath).style.width = $(menuPath+"-grid").getWidth();
	}
}

function checkRefOrgInput(value, id, elelbl){
	$(id).setAttribute('filterStValue', value );
	setTimeout( "callFilterRefOrgValueChange('" + value + "', '" + id+  "', '"+elelbl+"')", 125);
}

function filterRefOrgValueChange(val, id, elelbl) {
	var lg = liveGrids[id];
	var requestParams = new Array();
	$(id).setAttribute('filterStValue', val );
	lg.setRequestParams( 
			{name: 'element', value: $(id).getAttribute('element')}, 
			{name: 'elementLabel', value: elelbl}, 
			{name: 'path', value: id}, 
			{name: 'filter', value: val}, 
			{name: 'returnFn', value: $(id).getAttribute('methodName')});
	if (val) {
		var countMDAjax = new Ajax.Request(
			$(id).getAttribute('countUrl'),
			{
				method: 'get',
				parameters: 'element='+id+'&filter='+val,
				onSuccess: function(req) {countMDComplete( id, req );}
			});
	} else {
		$(id+"-foot").innerHTML = "" ;
		var grid = $(id+'-grid');
		lg.setTotalRows( 1*grid.getAttribute('totalRows') );
		lg.requestContentRefresh(0);
	}
}

function callFilterRefOrgValueChange(value, id, elelbl){
	if( $( id + "-filter").value == value ){
		filterRefOrgValueChange(value, id, elelbl);
	} else {
		$(id).setAttribute('filterStValue', $( id + "-filter").value );
	}
}

/**
 * Function to set organization name
 * 
 * added on 10/22/2012
 * @author Shain Raj
 * @param ele
 * @param elelbl
 * @param retFn
 * @param orgName
 * @param orgId
 * @return
 */
function setRefOrganization(ele, elelbl, retFn, orgName, orgId) {
	$(elelbl+'referringOrganization').value = orgId + "~"+ orgName;
	$(elelbl+'refOrgSpanValue').innerHTML = orgName;
	$(ele+'-refOrgPop').hide();
	getReffOrgContacts(ele,elelbl);
}
/**
 * To show Members details for Emergency Situation Care
 * 
 * @author Suja
 * added on 11/06/2012
 */
function showEmergencySituationCareList() { 
	new Ajax.Updater('emergencySituationCare', '../five/emergencySituationCare.jsf', {
	    parameters: { element: 'echr:admin:emergencySituationCare', returnFn:'fetchStaffDetailInEmergency'}, evalScripts:true, 
	    onComplete:function(req) {
	    	if ($('echr:admin:emergencySituationCare-filter'))
	    			$('echr:admin:emergencySituationCare-filter').value = "";
	    	$('emergencySituationCare').show();
	    	if ($('paneArea')!=null)
	    		$('paneArea').hide();
	    }
	});
}
/**
 * To hide Members details for Emergency Situation Care
 * 
 * @author Suja
 * added on 11/06/2012
 */
function hideEmergencySituationCareList() {
	$('emergencySituationCare').hide();
	if ($('paneArea')!=null)
		$('paneArea').show();
}

/**
 * To create Member Grid for Emergency Situation Care
 * 
 * @author Suja
 * added on 11/06/2012
 * @param menuPath		- Root path
 * @param methodName	- Method to be called on the grid selection
 */
function createMemberGrid(menuPath, methodName) {
	var root = $(menuPath);
	var grid = $(menuPath + '-grid');
	var id = $('disasterId').value;
	
	// servlet url to fetch count and list of all staffs
	var ajaxUrl = "fetchMembers.ajaxemr";
	var countUrl = "countMembers.ajaxemr";
	
	// set the parameter values as Attributes
	if (root.getAttribute( 'gridOffset' ) == null) {
		root.setAttribute( 'gridOffset', grid.getAttribute( 'gridOffset'));
		root.setAttribute( 'gridSortCol', grid.getAttribute( 'gridSortCol'));
		root.setAttribute( 'gridSortDir', grid.getAttribute( 'gridSortDir'));
		root.setAttribute( 'filterEmrValue', "");
		root.setAttribute( 'menuPath', menuPath);
		root.setAttribute( 'element', menuPath);
		root.setAttribute( 'ajaxUrl', ajaxUrl);
		root.setAttribute( 'countUrl', countUrl);
		root.setAttribute( 'methodName', methodName);
	}
	
	// grid function
	liveGrids[menuPath] = new Rico.LiveGrid( menuPath + "-LG",
		1*grid.getAttribute('visibleRows'),
		1*grid.getAttribute('totalRows'),
		ajaxUrl,
		{	prefetchBuffer: true,
			tableClass: 'gridBody',
			loadingClass: 'gridLoading',
            scrollerBorderRight: '0px solid #FF0000',
			offset: 1*root.getAttribute('gridOffset'),
			sortCol: root.getAttribute('gridSortCol'),
			sortDir: root.getAttribute('gridSortDir'),
			largeBufferSize: 5.0,
			nearLimitFactor: 0.4,
			rootId: menuPath,
			onscroll : updateOffset,
			onRefreshComplete: updateSortInfo,
			requestParameters: [{name: 'element', value: root.getAttribute('element')},
								{name: 'filter', value: root.getAttribute('filterEmrValue')},
								{name: 'returnFn', value: root.getAttribute('methodName')},
								{name: 'id', value: id},
								{name: 'path', value: root.getAttribute('menuPath')}],
			sortAscendImg: '../images/sort_asc.gif',
			sortDescendImg:'../images/sort_desc.gif'
		});

	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)*2+'px';
	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)+'px';
	grid.style.border = '#999999 solid 1px';
	$(menuPath+"-filter").value = root.getAttribute('filterEmrValue');
	
	// function called on the filter text event
	new Form.Element.Observer( $(menuPath+"-filter"), 1, function(element, val) {
		checkMemberInput(val, menuPath);
	} );
	if( $(menuPath).getAttribute('filterEmrValue') != null && $(menuPath).getAttribute('filterEmrValue') != "" ) {
		// calling the filter function, if there is a filter value
		filterMemberValueChange($(menuPath).getAttribute('filterEmrValue'), menuPath);
	}

	// Move Focus to Filter textbox.
	var filterBoxId = menuPath + "-filter";
	setFocus(filterBoxId );
	
	//reset the popup grid width after the grid is created
	if($(menuPath).className == "popupgrid"){
		$(menuPath).style.width = $(menuPath+"-grid").getWidth();
	}
}
/**
 * To check the Member input value and call the filter function
 * 
 * @author Suja
 * added on 11/06/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function checkMemberInput(value, id ){
	// set the filter value in the Attribute
	$(id).setAttribute('filterEmrValue', value );
	setTimeout( "callFilterMemberValueChange('" + value + "', '" + id+  "')", 125);
}

/**
 * To call filter function on filter value change
 * 
 * @author Suja
 * added on 11/06/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function callFilterMemberValueChange(value, id){
	if( $( id + "-filter").value == value ){
		filterMemberValueChange(value, id);
	} else {
		$(id).setAttribute('filterEmrValue', $( id + "-filter").value );
	}
}

/**
 * Function called on the filter value change
 * 
 * @author Suja
 * added on 11/06/2012
 * @param value			- Filter value
 * @param id			- Root path
 */
function filterMemberValueChange(val, id) {
	var lg = liveGrids[id];
	var requestParams = new Array();
	$(id).setAttribute('filterEmrValue', val );
	// setting the parameters for grid functionality
	lg.setRequestParams( 
			{name: 'element', value: $(id).getAttribute('element')}, 
			{name: 'path', value: id}, 
			{name: 'filter', value: val}, 
			{name: 'returnFn', value: $(id).getAttribute('methodName')});
		// calling the servlet request to fetch staff count corresponding to the filter
	if (val) {
		var countMDAjax = new Ajax.Request(
			$(id).getAttribute('countUrl'),
			{
				method: 'get',
				parameters: 'element='+id+'&filter='+val,
				onSuccess: function(req) {countMDComplete( id, req );}
			});
	} else {
		$(id+"-foot").innerHTML = "" ;
		var grid = $(id+'-grid');
		lg.setTotalRows( 1*grid.getAttribute('totalRows') );
		lg.requestContentRefresh(0);
	}
}
function showHcpcsModifierList(element, methodName) {
	new Ajax.Updater(element + '-Modifier', '../five/admin/hcpcsModifierList.jsf', {
	    parameters: { element: element + '-Modifier', methodName:methodName}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-Modifier-hcpcsMod-filter").value = "";
	    	$(element + '-Modifier').show();
	    }
	});
}
function showFeeScheduleList(element, methodName) {
	new Ajax.Updater(element + '-FeeSchedule', '../five/admin/feeScheduleList.jsf', {
	    parameters: { element: element + '-FeeSchedule', methodName:methodName}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-FeeSchedule-feeSchedule-filter").value = "";
	    	$(element + '-FeeSchedule').show();
	    }
	});
}
createFeeScheduleGrid = function(menuPath, id, methodName, methodArgs, ajaxUrl,
		curElement) {	
	if (!id)
		id = menuPath;
	var root = $(id);
	var grid = $(id + '-grid');
	if (!curElement)
		curElement = menuPath;
	if (root.getAttribute('gridOffset') == null) {
		root.setAttribute('gridOffset', grid.getAttribute('gridOffset'));
		root.setAttribute('gridSortCol', grid.getAttribute('gridSortCol'));
		root.setAttribute('gridSortDir', grid.getAttribute('gridSortDir'));
		root.setAttribute('filterCodeValue', "");
		root.setAttribute('menuPath', menuPath);
		root.setAttribute('element', curElement);
	}

	var methodNameValue = methodName;
	var methodArgsValue = methodArgs;

	if (methodName == undefined) {
		methodNameValue = "";
	}

	if (methodArgs == undefined) {
		methodArgsValue = "";
	}

	liveGrids[id] = new Rico.LiveGrid(id + "-LG", 1 * grid
			.getAttribute('visibleRows'), 1 * grid.getAttribute('totalRows'),
			ajaxUrl, {
				prefetchBuffer : true,
				tableClass : 'gridBody',
				loadingClass : 'gridLoading',
				scrollerBorderRight : '0px solid #FF0000',
				offset : 1 * root.getAttribute('gridOffset'),
				sortCol : root.getAttribute('gridSortCol'),
				sortDir : root.getAttribute('gridSortDir'),
				largeBufferSize : 5.0,
				nearLimitFactor : 0.4,
				rootId : id,
				onscroll : updateOffset,
				onRefreshComplete : updateSortInfo,
				requestParameters : [ {
					name : 'element',
					value : root.getAttribute('element')
				}, {
					name : 'filter',
					value : root.getAttribute('filterCodeValue')
				}, {
					name : 'methodName',
					value : methodNameValue
				}, {
					name : 'methodArgs',
					value : methodArgsValue
				}, {
					name : 'path',
					value : root.getAttribute('menuPath')
				} ],
				sortAscendImg : '../images/sort_asc.gif',
				sortDescendImg : '../images/sort_desc.gif'
			});

	grid.style.width = ($(id + '-LG_header').offsetWidth + 19) * 2 + 'px';
	grid.style.width = ($(id + '-LG_header').offsetWidth + 19) + 'px';
	grid.style.border = '#999999 solid 1px';
	$(id + "-filter").value = root.getAttribute('filterCodeValue');
	new Form.Element.Observer($(id + "-filter"), 1, function(element, val) {
		checkFilterInput(element, val, id, methodNameValue, methodArgsValue,
				menuPath, "countFeeScheduleData.ajaxlt");
	});
	if ($(id).getAttribute('filterCodeValue') != null
			&& $(id).getAttribute('filterCodeValue') != "") {
		filterBoxValueChange($(id + "-filter"), $(id).getAttribute(
				'filterCodeValue'), id, methodNameValue, methodArgsValue,
				menuPath, "countFeeScheduleData.ajaxlt");
	}

	// Move Focus to Filter textbox.
	var filterBoxId = id + "-filter";
	setFocus(filterBoxId);

	// reset the popup grid width after the grid is created
	// this fix is needed only for IE. ok to keep for FF too.
	if ($(id).className == "popupgrid") {
		$(id).style.width = $(id + "-grid").getWidth();
	}
}
showEmailTemplateList = function(element){
	var list = new Ajax.Updater('emailTemplatePage','../five/emailTemplate/emailTemplateList.jsf',{
		  parameters: { element: element}, evalScripts:true,
	        onComplete:function(req) {
	        }
	});
}
/**
 * Function to include tinyMce properties to textarea.
 * @param id
 */
function initTinyMCE(id) {
	tinyMCE.init({
		// General options
		mode : "textareas",
		theme : "advanced",
		width: $(id) ? $(id).getWidth() : "665",
		height: $(id) ? $(id).getHeight() : "263",
		plugins : "",
		// Theme options
		theme_advanced_buttons1 : "fontselect,fontsizeselect,bold,italic,underline",
		theme_advanced_buttons2 : "",
		theme_advanced_buttons3 : "",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		handle_event_callback: function(e,activeEditor) {
			if (e.type=='keyup') {
				document.getElementsByName(id)[0].value = activeEditor.getContent();
			}
		}
	});
}

/**
 * To create  grid for showing email templates
 */
createEmailTemplatesGrid = function(menuPath, id, methodName, methodArgs, ajaxUrl,
		curElement) {	

	var root = $(menuPath);
	var grid = $(menuPath + '-grid');
	
	// servlet request for finding the count and list for the Staff Activities
	var ajaxUrl = "findEmailTemplates.ajaxadm";
	var countUrl = "countEmailTemplates.ajaxadm";
	
	// set the parameter values as Attributes
	if (root.getAttribute( 'gridOffset' ) == null) {
		root.setAttribute( 'gridOffset', grid.getAttribute( 'gridOffset'));
		root.setAttribute( 'gridSortCol', grid.getAttribute( 'gridSortCol'));
		root.setAttribute( 'gridSortDir', grid.getAttribute( 'gridSortDir'));
		root.setAttribute( 'filterActValue', "");
		root.setAttribute( 'menuPath', menuPath);
		root.setAttribute( 'element', menuPath);
		root.setAttribute( 'ajaxUrl', ajaxUrl);
		root.setAttribute( 'countUrl', countUrl);
	}
	
	// grid function
	liveGrids[menuPath] = new Rico.LiveGrid( menuPath + "-LG",
		1*grid.getAttribute('visibleRows'),
		1*grid.getAttribute('totalRows'),
		ajaxUrl,
		{	prefetchBuffer: true,
			tableClass: 'gridBody',
			loadingClass: 'gridLoading',
            scrollerBorderRight: '0px solid #FF0000',
			offset: 1*root.getAttribute('gridOffset'),
			sortCol: root.getAttribute('gridSortCol'),
			sortDir: root.getAttribute('gridSortDir'),
			largeBufferSize: 5.0,
			nearLimitFactor: 0.4,
			rootId: menuPath,
			onscroll : updateOffset,
			onRefreshComplete: updateSortInfo,
			requestParameters: [{name: 'element', value: root.getAttribute('element')},
								{name: 'filter', value: root.getAttribute('filterActValue')},
								{name: 'path', value: root.getAttribute('menuPath')}],
			sortAscendImg: '../images/sort_asc.gif',
			sortDescendImg:'../images/sort_desc.gif'
		});

	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)*2+'px';
	grid.style.width = ($(menuPath+'-LG_header').offsetWidth+19)+'px';
	grid.style.border = '#999999 solid 1px';
//	$(menuPath+"-filter").value = root.getAttribute('filterActValue');
	
	// function called on the filter text event
	new Form.Element.Observer( $(menuPath+"-filter"), 1, function(element, val) {
		checkStaffActivityInput(val, menuPath);
	} );
	if( $(menuPath).getAttribute('filterActValue') != null && $(menuPath).getAttribute('filterActValue') != "" ) {
		// calling the filter function, if there is a filter value
		filterStaffActivityValueChange($(menuPath).getAttribute('filterActValue'), menuPath,menuPath);
	}

	//reset the popup grid width after the grid is created
	if($(menuPath).className == "popupgrid"){
		$(menuPath).style.width = $(menuPath+"-grid").getWidth();
	}

}

function showEmailTemplate(templateId,element){
	var popup = new Ajax.Updater(element+'-widget','../five/emailTemplate/emailTemplatePage.jsf',{
		  parameters: { element: element}, evalScripts:true,
	        onComplete:function(req) {
	        	$('emailTemplateSave').hide();
	        	$('tinyMceParent').hide();
	        	$('emailTemplateView').show();
	        	$('emailTemplate').setAttribute("readonly","readonly");
	        	wizHideAjaxLoader();
	        }
	});
	wizShowAjaxPopup(element+'-widget', 'View Email Template');
	var params = "templateId="+templateId;
	var instAjax = new Ajax.Request(
			'getEmailTemplateDetails.ajaxadm',
			{
				method : 'GET',
				parameters : params,
				onComplete : function(req) {
					if(req.responseText != "Failure"){
						var response = req.responseText.split("$$");
						$('emailTemplateView').innerHTML = response[2];
						jQuery('#emailTypeSelector').empty();
						var DropdownBox = $('emailTypeSelector');
						var target=document.getElementById('myselect');    
						var optionName = new Option(response[1], response[0]+"~~"+response[1]);    
						var targetlength = DropdownBox.length;    
						DropdownBox.options[targetlength] = optionName; 
/*						$('emailTemplate').options[0] = new Option(response[1],response[0]+"~~"+response[1]);
*/					}
				}
			});
}
function deleteEmailTemplate(templateId, element){
	if (confirm( "Delete email template?" )) {
		var params = "templateId="+templateId+"&deleteTemplate=true";
		var instAjax = new Ajax.Request(
				'getEmailTemplateDetails.ajaxadm',
				{
					method : 'GET',
					parameters : params,
					onComplete : function(req) {
						if(req.responseText != "Failure"){
							showEmailTemplateList(element);
						}
					}
				});
	 }
}
/**
 * #1397-Function called to list out only the nurse staff
 * @author priyanka
 * added on 13/12/2012
 * @param element
 * @param formId
 * @param index
 */
function showNurseListForIntakeStatusWizard(element, formId, index) { 
	wizShowAjaxLoader();
	new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-Staff', returnFn:'setNurseInIntakeStatusWizard', staffType:'Nurse'}, evalScripts:true, onComplete:function(req) {	   
	    wizHideAjaxLoader();
	    $(element + '-Staff').show();	    
	    $(element + '-Staff-widget').style.top = "200px";
	    $(element + '-Staff-widget').style.left = "500px";	    	
	    }
	});
}
/**
 * #1397-Function called to set the name of the nurse in member wizard
 * @author priyanka
 * added on 13/12/2012
 * @param element
 * @param refPath
 * @param staffType
 * @param staffName
 */
function setNurseInIntakeStatusWizard(element, refPath, staffType, staffName) {
	var root = element.replace(":","").replace(":","").replace("-","").replace("-","").split("-")[0];
	$(root+"-nurseName").innerHTML = staffName;
	$(root+":nurseName").value = staffName;
	$(element).hide();			
			
}
function showHospitalList(element, methodName) {
	new Ajax.Updater(element + '-Hospital', '../five/admin/hospitalList.jsf', {
	    parameters: { element: element + '-Hospital', methodName:methodName}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-Hospital-hospital-filter").value = "";
	    	$(element + '-Hospital').show();
	    }
	});
}
createHospitalGrid = function(menuPath, id, methodName, methodArgs, ajaxUrl,
		curElement) {	
	if (!id)
		id = menuPath;
	var root = $(id);
	var grid = $(id + '-grid');
	if (!curElement)
		curElement = menuPath;
	if (root.getAttribute('gridOffset') == null) {
		root.setAttribute('gridOffset', grid.getAttribute('gridOffset'));
		root.setAttribute('gridSortCol', grid.getAttribute('gridSortCol'));
		root.setAttribute('gridSortDir', grid.getAttribute('gridSortDir'));
		root.setAttribute('filterCodeValue', "");
		root.setAttribute('menuPath', menuPath);
		root.setAttribute('element', curElement);
	}

	var methodNameValue = methodName;
	var methodArgsValue = methodArgs;

	if (methodName == undefined) {
		methodNameValue = "";
	}

	if (methodArgs == undefined) {
		methodArgsValue = "";
	}

	liveGrids[id] = new Rico.LiveGrid(id + "-LG", 1 * grid
			.getAttribute('visibleRows'), 1 * grid.getAttribute('totalRows'),
			ajaxUrl, {
				prefetchBuffer : true,
				tableClass : 'gridBody',
				loadingClass : 'gridLoading',
				scrollerBorderRight : '0px solid #FF0000',
				offset : 1 * root.getAttribute('gridOffset'),
				sortCol : root.getAttribute('gridSortCol'),
				sortDir : root.getAttribute('gridSortDir'),
				largeBufferSize : 5.0,
				nearLimitFactor : 0.4,
				rootId : id,
				onscroll : updateOffset,
				onRefreshComplete : updateSortInfo,
				requestParameters : [{ name : 'element', value : root.getAttribute('element') }, 
				                     { name : 'filter', value : root.getAttribute('filterCodeValue')}, 
				                     { name : 'methodName',	value : methodNameValue	}, 
				                     { name : 'methodArgs',	value : methodArgsValue	}, 
				                     { name : 'path', value : root.getAttribute('menuPath')	}],
				sortAscendImg : '../images/sort_asc.gif',
				sortDescendImg : '../images/sort_desc.gif'
			});

	grid.style.width = ($(id + '-LG_header').offsetWidth + 19) * 2 + 'px';
	grid.style.width = ($(id + '-LG_header').offsetWidth + 19) + 'px';
	grid.style.border = '#999999 solid 1px';
	$(id + "-filter").value = root.getAttribute('filterCodeValue');
	new Form.Element.Observer($(id + "-filter"), 1, function(element, val) {
		checkFilterInput(element, val, id, methodNameValue, methodArgsValue,
				menuPath, "countHospitalData.ajaxorg");
	});
	if ($(id).getAttribute('filterCodeValue') != null
			&& $(id).getAttribute('filterCodeValue') != "") {
		filterBoxValueChange($(id + "-filter"), $(id).getAttribute(
				'filterCodeValue'), id, methodNameValue, methodArgsValue,
				menuPath, "countHospitalData.ajaxorg");
	}

	var filterBoxId = id + "-filter";
	setFocus(filterBoxId);

	if ($(id).className == "popupgrid") {
		$(id).style.width = $(id + "-grid").getWidth();
	}
}


/**
 * Displays the staff pop up from intake status wizard.
 * @param element
 * @return
 * @author Abhilash KP
 * @since v 0.0.116
 */
function showStaffListForIntake(element) { 
	wizShowAjaxLoader();
	new Ajax.Updater(element + '-StaffMember', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-StaffMember', returnFn:'setStaffInIntakeWizard',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	wizHideAjaxLoader();
	    	try {	    		
	    		$(element + '-StaffMember').show();
	    		$(element + '-StaffMember-widget').style.top = "540px";
	    		$(element + '-StaffMember-widget').style.left = "500px";
	    	} catch(e){
	    		
	    	}
	    	 
	    }
	});
}


/**
 * Sets the staff in the intake status.
 * @param element
 * @return
 * @author Abhilash Kp
 * 
 */
function setStaffInIntakeWizard(element, refPath, staffType, staffName, licNo, phone) {
	try{		
		var root = $(element.split("-StaffMember")[0]+"-elementLabelValue").value;
		$(root+':hraNameLbl').innerHTML = staffName;
		$(root+':hraName').value = staffName;
		$(element).hide();
	} catch(e){
		
	}
	
}
/**
 * To show staff type widget in staff wizard.
 * @author Rahmathulla
 */
function showStaffTypeConfig(path) {
    new Ajax.Updater('showStaffTypeConfig-widget','../wizard/manageStaffTypeConfig.jsf', {
         parameters:{ element: path }, onComplete:function(req) {
                    $('showStaffTypeConfig-widget').show();
                    $('addNewType').show();
                    wizHideAjaxLoader();
                    wizShowAjaxPopup("showStaffTypeConfig-widget", "Staff Type Configuration");
           }
    });
}

displayStaffTypeDiv=function(id,rowId) {
    $('save'+rowId).hide();
    $('edit'+rowId).show();
    return;
}

/**
 * Function to save staff type in staff wizard.
 * 
 * @author Rahmathulla
 *  
*/
function saveStaffTypeConfig(typeId,codeId,element) {
	var staffType = encodeURIComponent($(typeId).value);
	var staffTypeCode = $(codeId).value;

	if (staffType == null || trim(decodeURIComponent(staffType)) == "") { 
		$('staffTypeErrorMsg').innerHTML="Please enter staff type ...";
		fade('staffTypeErrorMsg');
	    return false;
	}
	
	if (staffTypeCode == null || trim(staffTypeCode) == "") { 
		$('staffTypeCodeErrorMsg').innerHTML="Please enter staff code ...";
		fade('staffTypeCodeErrorMsg');
	    return false;
	}
	
	wizShowAjaxLoader();
	var myAjax = new Ajax.Request( 'saveStaffType.ajaxcp', {
		method: 'get',
		parameters: 'staffType=' + staffType + '&code=' + escape(staffTypeCode),
		onFailure: function(request) {displayError(request, element);},
		onSuccess: function(request) {
			var response = request.responseText;
			
			if(response.trim() == 'No Duplicates'){
				$('staffType').value = '';
				$('staffTypeCode').value = '';	
				$('staffTypeCodeErrorMsg').innerHTML = "Staff Type is Created ...";
				fade('staffTypeCodeErrorMsg');
				setTimeout("closeStaffTypeConfig('" + element+ "');", 100);
			} else if(response.trim() == 'Staff type already exist') {
				wizHideAjaxLoader();
				$('staffTypeErrorMsg').innerHTML = response;
				fade('staffTypeErrorMsg');	
			} else if (response.trim() == 'Staff code already exist') {
				wizHideAjaxLoader();
				$('staffTypeCodeErrorMsg').innerHTML = response;
				fade('staffTypeCodeErrorMsg');
			} else {
				wizHideAjaxLoader();
				$('staffTypeCodeErrorMsg').innerHTML = response;
				fade('staffTypeCodeErrorMsg');
			}
		}
	});
}

/**
 * To close stafftype widget in staff wizard.
 */
closeStaffTypeConfig=function(element) {
	$('showStaffTypeConfig-widget').hide();
    showStaffTypeConfigDropDown(element);
    wizHideAjaxPopup("showStaffTypeConfig-widget", "Staff Type Configuration");
}

/**
* Function to show the staff type drop-down
*/

function showStaffTypeConfigDropDown(path) { 
	new Ajax.Updater('showManageStaffDropDownDiv', '../wizard/dropDownStaffTypeConfigTemplate.jsf', {
	    parameters: { element: path }, evalScripts:true, onComplete:function(req) {wizHideAjaxLoader();}
	});
}

/**
* Function to remove the staff type in staff wizard.
*/

function showRemoveStaffTypeConfig(element,id,rowId) {
	if (confirm('Are you sure you want to delete? ')) {
		removeStaffTypeConfig(element, id, rowId);
	}
}

function removeStaffTypeConfig(path, id, rowId) {
	var params = "id="+id;
	wizShowAjaxLoader();
	var instAjax = new Ajax.Request(
		    'removeStaffType.ajaxcp',
    {
	   method: 'get',
	   parameters: params,
	   onComplete: function(req) {
		   $('edit'+rowId).hide();
		    	var result = req.responseText.split("$#$");
				if (result[0] == "Success") {
					$('save'+rowId).show();
					$('errorMsg').innerHTML = "Staff Type Removed...";
					fade('errorMsg');
					 new Ajax.Updater('showStaffTypeConfig-widget','../wizard/manageStaffTypeConfig.jsf', {
				         parameters:{ element: path }, onComplete:function(req) {
				        	 		$('showStaffTypeConfig-widget').show();
				        	 		$('typeListDiv').show();
				                    $('addNewTypelink').show();
				                    $('showAllTypelink').hide();
				                    $('addNewType').hide();
				                    wizHideAjaxLoader();
			                        showStaffTypeConfigDropDown(path);
				                    wizShowAjaxPopup("showStaffTypeConfig-widget", "Staff Type Configuration");
				           }
				    });
				} else if (result[0] == "Associate") {
					wizHideAjaxLoader();
					var count = result[1];
					alert("Cannot Delete!!. Staff Type: "+name+" is associated with "+count+" number of staff(s)");
				}
		    }
    });
}

/**
* Function to update the staff type in staff wizard.
*/

function updateStaffTypeConfig(id, rowId, path){
	var staffType = encodeURIComponent($('staffType'+rowId).value);
	var staffTypeCode = $('staffTypeCode'+rowId).value;
	
	if (staffType == null || trim(decodeURIComponent(staffType)) == "") { 
		$('errorMsg').innerHTML="Please enter staff type ...";
		fade('errorMsg');
	    return false;
	}
	
	if (staffTypeCode == null || trim(staffTypeCode) == "") { 
		$('errorMsg').innerHTML="Please enter staff code ...";
		fade('errorMsg');
	    return false;
	}
	wizShowAjaxLoader();
	var myAjax = new Ajax.Request( 'updateStaffTypeConfig.ajaxcp', {
		method: 'get',
		parameters: 'staffType=' + staffType + '&code=' + escape(staffTypeCode)+ '&id=' + id ,
		onFailure: function(request) {displayError(request, element);},
		onSuccess: function(request) {
			$('edit'+rowId).hide();
			var response = request.responseText;
			if(response.trim() == 'No Duplicates' ){
				$('errorMsg').innerHTML ="Staff Type has been updated";
				fade('errorMsg');
				showStaffTypeConfigOnUpdate(path);
			} else {
				$('errorMsg').innerHTML = response;
				fade('errorMsg');	
				showStaffTypeConfigOnUpdate(path);
			}
			
		}
	});
}

function showStaffTypeConfigOnUpdate(path) {
	new Ajax.Updater('showStaffTypeConfig-widget','../wizard/manageStaffTypeConfig.jsf', {
        parameters: { element: path }, onComplete:function(req) {
            $('showStaffTypeConfig-widget').show();
            $('typeListDiv').show();
            $('addNewTypelink').show();
            $('showAllTypelink').hide();
            $('addNewType').hide();
            wizHideAjaxLoader();
            showStaffTypeConfigDropDown(path);
          }
     });
	
}

function setStaffTypeCodeInStaffConfig(elementLabel) {
	$(elementLabel+':str_staffType').value= $('staffType').options[$('staffType').selectedIndex].text;
	$(elementLabel+':str_staffTypeCode').value=$('staffType').options[$('staffType').selectedIndex].value;
}

/**
 * Password comparison for #1716
 * @author Rahmathulla
 */
function passwordCompare(elementLabel){
	var pswd = "";
	var confPswd = "";
	if(elementLabel.indexOf("resetLoginPassword") != -1 || elementLabel.indexOf("setPassword") != -1 || elementLabel.indexOf("password") != -1){
		 pswd  = $(elementLabel+":newUserPassword").value;
		 confPswd  = $(elementLabel+":newUserPassword2").value;
	}
	if(elementLabel.indexOf("register") != -1 || elementLabel.indexOf("resetInvite") != -1 || elementLabel.indexOf("registerInvite") != -1 ){
		 pswd  = $(elementLabel+":userPassword").value;
		 confPswd  = $(elementLabel+":userPassword2").value;
	}
	
	var validPswd = checkValidPassword(elementLabel);
	
	if(!validPswd){
		clearConfirmPassword(elementLabel);
	} else {
		checkPasswordMatch(pswd,confPswd,elementLabel);
	}
}

function checkValidPassword(elementLabel){
	var pswd ="";
	if(elementLabel.indexOf("resetLoginPassword") != -1 || elementLabel.indexOf("setPassword") != -1 || elementLabel.indexOf("password") != -1){
		pswd = $(elementLabel+":newUserPassword").value;
	}
	
	if(elementLabel.indexOf("register") != -1 || elementLabel.indexOf("resetInvite") != -1 ||  elementLabel.indexOf("registerInvite") != -1 ){
		pswd  = $(elementLabel+":userPassword").value;
	}
	
	if(pswd == null || pswd ==""){
		$(elementLabel+":msg").innerHTML = "Please enter Password field first";
		return false;
	} else {
		$(elementLabel+":msg").innerHTML ="";
		return true;
	}
}

function clearConfirmPassword(elementLabel){
	if(elementLabel.indexOf("resetLoginPassword") != -1 || elementLabel.indexOf("setPassword") != -1 || elementLabel.indexOf("password") != -1){
		$(elementLabel+":newUserPassword2").value = $(elementLabel+":newUserPassword2").value.replace(/[^]+/g,"");
	}
	
	if(elementLabel.indexOf("register") != -1 || elementLabel.indexOf("resetInvite") != -1 || elementLabel.indexOf("registerInvite") != -1 ){
		$(elementLabel+":userPassword2").value = $(elementLabel+":userPassword2").value.replace(/[^]+/g,"");
	}
}

function checkPasswordMatch(pswd,confPswd,elementLabel){
	if(pswd.length >= confPswd.length){
		for(i=0; i<=confPswd.length-1; i++){
			if(pswd[i]  != confPswd[i]){
				$(elementLabel+":msg").innerHTML = "Passwords do not match";
				break;
			}
			$(elementLabel+":msg").innerHTML ="";
		}
	} else {
		$(elementLabel+":msg").innerHTML = "Passwords do not match";
	}
}

function checkPasswordLength(pswd, confPswd, elementLabel) {
	if(confPswd.length < pswd.length ){
		$(elementLabel+":msg").innerHTML = "Passwords do not match";
	}
}

/**
 * To populate staff popup on staff Re-assignment widget
 * 
 * @author Jitha
 */
function showStaffListForStaffReAssignment(element, formId, returnFunction) { 
	new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-Staff', returnFn:returnFunction, staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-Staff-filter").value = "";
	    	$(element + '-Staff').show();
	    }
	});
}

/**
 * To display staff on  To staff Re-assignment widget
 * 
 * @author Jitha
 */
function setToStaffValues(element, refPath, staffType, staffName, licNo, phone) {
	$('toStaffLabel').innerHTML = staffName;
	$('toStaff').value = staffName;
	$('toStaffRefPath').value = refPath;
	$(element).hide();
}
/**
 * To display staff on From staff Re-assignment widget
 * 
 * @author Jitha
 */
function setFromStaffValues(element, refPath, staffType, staffName, licNo, phone) {
	$('fromStaffLabel').innerHTML = staffName;
	$('fromStaff').value = staffName;
	$('fromStaffRefPath').value = refPath;
	$(element).hide();
}


/**
 * For staff Re-assignment process 
 * 
 * @author Jitha
 */
function reAssignStaffs(element, label) {
	if (validateStaffReAssignment()==true){
		var fromStaff= $('fromStaff').value;
		var tostaff = $('toStaff').value;
		var fromStaffPath = $('fromStaffRefPath').value;
		var toStaffPath = $('toStaffRefPath').value;
		var fromRole = $('fromRole').value;
		var message = "Do you want to reassign \""+ fromStaff;
		if(fromRole != null && trim(fromRole) !=""){
			message += "\" with staff type \""+fromRole +"\"";
		}
		message += "  to \""+ tostaff+"\"?";
			if (confirm( message )) {
				$(element+"-msg").innerHTML = "Staff re-assignment started in background ...."
					var instAjax = new Ajax.Request('reAssignStaff.ajaxcteam', {
						method : 'get',
						parameters : { 
										element: element,
										fromStaff: fromStaff,
										tostaff: tostaff,
							 			fromStaffPath: fromStaffPath,
							 			toStaffPath: toStaffPath,
							 			fromRole: fromRole
									  },
						onComplete : function(req) {
							if(req.responseText.indexOf("is not assigned to any member") == -1 && req.responseText.indexOf("Please try again. Something went wrong") == -1){
								 var instAjax = new Ajax.Request(
							    		'updateEventTableOnStaffReassign.ajaxstream', 
							    		{
							    			method: 'post', 
							    			parameters :  { 
												fromStaff: fromStaff,
												tostaff: tostaff,
									 			fromStaffPath: fromStaffPath,
									 			toStaffPath: toStaffPath,
									 			members:req.responseText.split("####")[1],
									 			fromRole: fromRole
											  },
								          onComplete: function(req) {} 
							    });
							}
							$(element+"-StaffMsg").innerHTML = req.responseText.split("####")[0];
							$(element + '-StaffMsg').show();
							wizShowAjaxPopup(element + "-StaffMsg", 'Message');
							setTimeout("clearMsg('"+element+"')",1000);	
						}
					});
			}
		
	}
}
function clearMsg(element){
	$(element+"-msg").innerHTML = "";
	$('fromStaffErrMsg').innerHTML = "*";
	$('toStaffErrMsg').innerHTML = "*";
	$('toStaffLabel').innerHTML = "";
	$('fromStaffLabel').innerHTML ="";
	$('fromStaff').value= "";
	$('toStaff').value= "";
	$('fromStaffRefPath').value= "";
	$('toStaffRefPath').value= "";
	 $('fromRole').value = "";$('fromRole').options[0].selected = "selected";
	 $("sameStaff").innerHTML = "";
	
}

function validateStaffReAssignment(){
	var flag = true;
	$('fromStaffErrMsg').innerHTML = "*";
	$('toStaffErrMsg').innerHTML = "*";
	if ($('fromStaff').value==""){
		$('fromStaffErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('fromStaffRefPath').value==""){
		$('fromStaffErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('toStaff').value==""){
		$('toStaffErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if ($('toStaffRefPath').value==""){
		$('toStaffErrMsg').innerHTML = "*Required";
		flag = false;
	}
	if($('fromStaff').value == $('toStaff').value){
		$("sameStaff").innerHTML = " To and From staff are the same. Please Select different staff.";
		flag = false;
	}
	return flag;
}
/**
 * Displays the staff pop up in Preferences->Account User
 * @param element
 * @return
 * @author Priyanka 
 * For #1950 added on 10/16/2013
 */
function showStaffListForAccountPreferences(element) { 
	new Ajax.Updater(element + '-Staff', '../five/admin/staffList.jsf', {
	    parameters: { element: element + '-Staff', returnFn:'setStaffInAccountPreferences',staffType:''}, evalScripts:true, onComplete:function(req) {
	    	$(element + "-Staff-filter").value = "";
	    	$(element + '-Staff').show();
	    	 
	    }
	});
}

/**
 * Sets the staff pop up in Preferences->Account User
 * @param element
 * @return
 * @author Priyanka 
 * For #1950 added on 10/16/2013
 */
function setStaffInAccountPreferences(element, refPath, staffType, staffName, licNo, phone) {
	var accUsrId= trim($('accountUser:accUsrId').innerHTML);
	wizShowAjaxLoader();
	var myAjax = new Ajax.Request( 'findOtherUserStaffAssociation.ajaxadm', {
	method: 'get',
	parameters: 'staffPath='+refPath+'&accUsrId='+accUsrId,
	onSuccess: function(request) {
		wizHideAjaxLoader();
		if(request.responseText == 'Duplicate') {
			alert("Staff is already associated with another user !!!");
		} else {
			$('accountUser:openMeFirst').value = refPath ;
			$('assignedStaff').innerHTML = staffName; 
			$(element).hide();
			$('addLink').hide();
			$('remLink').show();
		}
	},
	onFailure: function(request) {wizHideAjaxLoader();},
	});
}
/**
 * @author Priyanka 
 * To show the assigned staff in Preferences->Account User
 * @param path
 * For #1950 added on 10/16/2013
 */
function fetchAssignedStaffInAccountPreferences(path){
	wizShowAjaxLoader();
	var myAjax = new Ajax.Request( 'fetchStaffByMenuPath.ajaxadm', {
		method: 'get',
		parameters: 'path=' + path ,
		onSuccess: function(request) {
			wizHideAjaxLoader();
			$('assignedStaff').innerHTML = request.responseText;
			$('remLink').show();
			$('addLink').hide();
		},
		onFailure: function(request) {wizHideAjaxLoader();},
	});
}

/**
 * To show care team role list in admin
 * @author Rahmathulla
 * @param element
 * For #2117 added on 12/19/2013
 */
function showCareTeamRolesList(element) { 
	wizShowAjaxLoader();
	new Ajax.Updater(element, '../five/careteam/roles.jsf', {
	    parameters: { element: element }, evalScripts:true, onComplete:function(req) { 
	    	wizHideAjaxLoader();
	    }
	});
}

/**
 * To remove care team role list in admin
 * @author Rahmathulla
 * @param roleId
 * @param index
 * @param element
 * For #2117 added on 12/19/2013
 */
function removeCareTeamRole(roleId, index, element){
	if (confirm('Are you sure you want to delete? ')) {
		wizShowAjaxLoader();
		 var instAjax = new Ajax.Request(
		    'removeCareTeamRole.ajaxcteam', 
		    {
		    	method: 'get', 
		    	parameters : 'roleId=' +roleId,
			    onComplete: function(req) {
			    	wizHideAjaxLoader();
			    	var result = req.responseText.split("$#$");
					if (result[0] == "Success") {
						showCareTeamRolesList(element);
					} else if (result[0] == "Associate") {
						var count = result[1];
						alert("Can't delete, care team role is associated with member");
					}
			    }
		   });
	}
}

/**
 * To make care team roles editable in admin
 * @author Rahmathulla
 * @param rowId
 * For #2117 added on 12/19/2013
 */
function displayRoleDivInAdmin(rowId) {
    $('roleSave'+rowId).hide();
    $('roleEdit'+rowId).show();
    return;
}

/**
 * To update care team role
 * @author Rahmathulla
 * @param id
 * @param roleId
 * @param path
 * For #2117 added on 12/19/2013
 */

function updateCareTeamRole(id, rowId, path){
	var roleName = $('roleName'+rowId).value;
	var roleCode = $('roleCode'+rowId).value;
	
	if (roleName == null || trim(roleName) == "") { 
		$('errorMsg').innerHTML="Please enter role name ...";
		fade('errorMsg');
	    return false;
	}
	
	if (roleCode == null || trim(roleCode) == "") { 
		$('errorMsg').innerHTML="Please enter role code ...";
		fade('errorMsg');
	    return false;
	}
	wizShowAjaxLoader();
	var myAjax = new Ajax.Request( 'updateCareTeamRole.ajaxcteam', {
		method: 'get',
		parameters: 'roleName=' + roleName + '&roleCode=' + roleCode+ '&id=' + id ,
		onFailure: function(request) {displayError(request, element);},
		onSuccess: function(request) {
			$('roleEdit'+rowId).hide();
			var response = request.responseText;
			wizHideAjaxLoader();
			if(response.trim() == 'No Duplicates' ){
				$('errorMsg').innerHTML ="Role has been updated";
				fade('errorMsg');
				showCareTeamRolesList(path);
			} else {
				alert(response);	
				showCareTeamRolesList(path);
			}
		}
	});
}
/**
 * @author Priyanka
 * Added on 02/03/2014 for #2190
 * For removing associated staff in Preferences->Account User
 */
function removeStaffFromAccountPreferences(){
	$('accountUser:openMeFirst').value = "";
	$('assignedStaff').innerHTML = "";
	$('remLink').hide();
	$('addLink').show();
}
function showMemberListAndMemberProfile(element,elementLabel){
	var page='../five/memberProfile.jsf?elementLabel='+elementLabel+'&element='+element;
	if (window.opener) {
		window.location.href=page;
	} else {
		window.open(page);
	}
	
}
function toggleChartAndTableData(element,elementLabel,link1,link2,div1,div2){
	var $ = jQuery;
	$('#'+elementLabel+link1).addClass('active');
	$('#'+elementLabel+link2).removeClass('active');
	$('#'+elementLabel+div2).hide();
	$('#'+elementLabel+div1).show();
	checkForScroll();
}
function checkForScroll(){
    if($('county1')){
    	var bar = $('#countyListDiv').hasScrollBar();
	    if(!bar){
	    	$('#countyListTable').css('width','97.5%');
	    }
	    var barLang = $('#languageDisplayDiv').hasScrollBar();
	    if(!barLang){
	    	$('#languageListTable').css('width','97.5%');
	    	languageListTable
	    }	
    }else{
    	 setTimeout(function() { 
    		 checkForScroll();
		 }, 300);
    }
}
function setSelectedAccountUser(accountUserId) {
	$('selectedAccountUserId').value = accountUserId;
	$('userAccess:editLink').click();
}
/**
 * @author Priyanka
 * Added on 03/12/2014 for #2184 - For showing the pop up of roles for the selected account user
 * @param element
 * @param elementLabel
 * @param methodName
 */
function showRolesPopUp(element, elementLabel, methodName){
	$(element+'-popUpDiv').innerHTML == "";
	$(element+'-popUpDiv').show();
	new Ajax.Updater(element+'-popUpDiv', '../five/accountUserRolePopUpTemplate.jsf', {
		parameters: { 
			element      : element,
			methodName   : methodName,
			elementLabel : elementLabel
		},
		evalScripts:true,
		onComplete:function(req) {
		}
	});
}
/**
 * @author Priyanka
 * Added on 03/12/2014 for #2184 - For adding a selected role to the account user
 * @param role
 */
function addRolesToAccountUser(role){
	var rowCount = $('accountUser:accountRoleList').rows.length;
	for(var i=0; i <rowCount ; i++){
		if($('accountUser:accountRoleList:'+i).value == role){
			if($('accountUser:accountRoleList:'+i).checked){
				alert("Role already exists for this user");
				break;
			}else{
				$('accountUser:accountRoleList:'+i).checked = true;
				jQuery('#roleTable tbody').append('<tr class="child"><td>'+role+'</td><td><a href="javascript:void(0);" onclick="removeRoleFromAccountPreferences(\''+role+'\',this);" style="margin-left:4px;">X</a></td></tr>');
				break;
			}
		}
	}
	$('accountRoles').hide()
}
/**
 * @author Priyanka
 * Added on 03/12/2014 for #2184 - For removing a selected role from the account user
 * @param role
 * @param event
 */
function removeRoleFromAccountPreferences(role, event) {
	jQuery(event).parent().parent().remove();
	var rowCount = $('accountUser:accountRoleList').rows.length;
	for(var i=0; i <rowCount ; i++){
		if($('accountUser:accountRoleList:'+i).value == role){
			$('accountUser:accountRoleList:'+i).checked = false;
			break;
		}
	}
}
/**
 * To Delete delete Death
 * 
 * @author Jitha
 * added on 05/13/2014
 * @param  Id - adminAlertId
 */
function deleteDeathCause( deathCause ) {
	var element = "echr:admin:deathCause:all";
	var message = "Are you sure you want to delete the entry?"
		if (confirm( message )) {
			wizShowAjaxLoader();
			var myAjax = new Ajax.Request( 'deleteDeathCause.ajaxadm', {
				method: 'get',
				parameters: 'id=' + deathCause.id ,
				onSuccess: function(request) {
					wizHideAjaxLoader();
					var response = request.responseText;
					if(response.trim() == 'Exists' ){						
						alert("Sorry you can't delete this entry,its assigned with member.");
					} else {
					showOrganizationList(element,'deathCause');
					}
				},
				onFailure: function(request) {wizHideAjaxLoader();},
			});
		}
}
/**
 * To save Death Of death
 * 
 * @author Jitha
 * added on 05/13/2014
 */
function saveDeathCause(element,elementlabel) {
	var id = $(elementlabel+'causeOfDeathId').value;
	var code = $(elementlabel+'code').value;
	var displayName = $(elementlabel+'displayName').value;
	var description = $(elementlabel+'description').value;
	var codeSystemName = $(elementlabel+'codeSystemName').value;
	var codeSystemVersion = $(elementlabel+'codeSystemVersion').value;
	var msg = "";
	if(code == null || trim(code)== ''){
		msg += "code";
	}
	if(displayName == null || trim(displayName)== ''){
		if(trim(msg)!=''){
			msg += ", "
		}    	
		msg += "Display Name\n";
	}
	if(codeSystemName == null || trim(codeSystemName)== ''){
		if(trim(msg)!=''){
			msg += ", "
		} 
		msg += "Code System Name ";
	}
	if(codeSystemVersion == null || trim(codeSystemVersion)== ''){
		if(trim(msg)!=''){
			msg += ", "
		} 
		msg += "Code System Version ";
	}
	if(trim(msg)==''){
		wizShowAjaxLoader();
		var params = { id:id,code : code, displayName : displayName, description : description,codeSystemName : codeSystemName,codeSystemVersion:codeSystemVersion};
		var instAjax = new Ajax.Request( 'saveDeathCause.ajaxadm',  {
			method: 'get', 
			parameters: params,	    	
			onComplete: function(request){
				wizHideAjaxLoader();			
				var response = request.responseText;
				if(response.trim() == 'Duplicate' ){
					$('validationErrorMsgDeathCause').innerHTML ="Code Exists, please enter another Code.";
				}else if(response.trim() == "Failed"){
					wizHideAjaxLoader();
					$('validationErrorMsgDeathCause').innerHTML = "Unable to Save the Cause of Death. Please try Again.";				
				}else{
					wizHideAjaxLoader();
					$('validationErrorMsgDeathCause').innerHTML = "Cause of Death is Saved...";
					Windows.close("popup_"+element+"-DeathCauseWidget");
					showOrganizationList(element,'deathCause');
				}
			}
		});		
	}else{
		$('validationErrorMsgDeathCause').innerHTML="Please enter " + msg+".";
		fade('validationErrorMsgDeathCause');
		return false;
	}

}
/**
 * To Edit cause Of death
 * 
 * @author Jitha
 * added on 05/13/2014
 */
 
 
 /// static comment
 
function showDeathCauseWidget(deathCauseId, deathCause) {
	var element = "echr:admin:deathCause:all";
	var elementlabel = "echradmindeathCauseall";
	$(element + '-DeathCauseWidget').innerHTML = "";
	new Ajax.Updater(element + '-DeathCauseWidget', '../five/deathCause/add.jsf', {
		parameters: {element: element}, evalScripts:true, onComplete:function(req) {
          $(element + '-DeathCauseWidget').show();
          var title = "Add Cause of Death";
          if(deathCauseId != "0"){
        	  title = "Edit Cause of Death";
        	  $(elementlabel+'causeOfDeathId').value = deathCause.id;
        	  $(elementlabel+'code').value = deathCause.code;
        	  $(elementlabel+'code').disabled = true;
        	  $(elementlabel+'displayName').value = deathCause.displayName;
        	  $(elementlabel+'description').value = deathCause.description;
        	  $(elementlabel+'codeSystemName').value = deathCause.codeSystemName;
        	  $(elementlabel+'codeSystemVersion').value = deathCause.codeSystemVersion;
          }
          wizShowAjaxPopup(element + '-DeathCauseWidget', title);          
      }
	});
}

function showSentFaxDetailsList(element, folderName){ 
	new Ajax.Updater(element+'-List', '../five/' + folderName + '/list.jsf', {
	    parameters: { element: element }, evalScripts:true, onComplete:function(req) {}
	});
}
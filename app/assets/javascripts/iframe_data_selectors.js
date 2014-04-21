$( document ).ready(function() {
  addListenersToIframe();
  unbindAndRebindIframe();
});

function addListenersToIframe() {
  getDataFromIframeBy("Text");
  if( $('#iframe-side-helper').is(':visible') ) {
    $('#iframe-side-helper').hide();
    $('#tab-bar').show();
    $('#gem-form-column').show();
  }
}

function unbindAndRebindIframe() {
  $(".fa-align-left, .fa-link, .fa-picture-o").click(function(e){
    var usersChoice = $(this).children().text();
    getDataFromIframeBy(usersChoice);
  });
}

function getDataFromIframeBy(dataType) {
  $("iframe").contents().find("html").each(function() {
    $(this).bind("click", function(e) { 
      e.preventDefault();
      var eTarget = e.target,
        data = getDataBy(dataType, eTarget),
        path = pathCorrector(dataType, getPathTo(eTarget));
      $("#last-gem-method .last-data-field").text(data);
      if(eTarget.classList[0] === "gem-it-iframe") {
        var correctPath = path.replace(/video/, "iframe");
        $("#last-gem-method .last_path").val(correctPath);
      } else {
        $("#last-gem-method .last_path").val(path);
      }
      $("#last-gem-method .method_datatypes").val(dataType);
      dataSelectorErrorListener();
    });
  });
}

function getDataBy(dataType, eTarget) {
  if (dataType === "Text"){
    return eTarget.innerText || eTarget.textContent || "No text here.";
  }
  else if(dataType === "Links") {
    return eTarget.href || eTarget.parentNode.href || "No links here.";
  }
  else {
    return eTarget.src || "No media here.";
  }
}

function getPathTo(element) {
  if (element.id!=='')
    return 'id(\"'+element.id+'\")';
  if (element===document.body)
    return element.tagName.toLowerCase();

  var ix= 0;
  var siblings= element.parentNode.childNodes;
  for (var i= 0; i<siblings.length; i++) {
    var sibling= siblings[i];
    if (sibling===element)
      return getPathTo(element.parentNode)+'/'+element.tagName.toLowerCase()+'['+(ix+1)+']';
    if (sibling.nodeType===1 && sibling.tagName===element.tagName)
      ix++;
  }
}

function dataSelectorErrorListener(){
  var selectorErrors = [
    "No text here.", "No links here.", "No media here."
  ];
  var $usersChoice = $("#last-gem-method .last-data-field");
  if ($.inArray($usersChoice.text(), selectorErrors) > -1){
    $usersChoice.addClass("error-message");
  }
  else {
    $usersChoice.removeClass("error-message");
  }
}

function pathCorrector(dataType, path) {
  if (dataType === "Links") {
    return path.match(/.+a\[\d\]/)[0];
  } else {
    return path;
  }
}
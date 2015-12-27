$(document).ready(function() {
    "use strict";
    var ENDPOINT = "http://localhost:3000/tasks";
    function taskEndpoint(taskId) {
        return ENDPOINT + "/" + taskId;
    }

    function showPanel(panelName) {
        var ALL_PANELS = ["emptyPanel", "readPanel", "updatePanel", "createPanel"];
        _.forEach(ALL_PANELS, function(nextValue) {
            $("#"+nextValue).hide();
        });
        $("#"+panelName).show();
    }

    function listTasks() {
        return $.ajax(ENDPOINT, {
            method: "GET",
            dataType: "json"
        });
    }
    function readTask(taskId) {
        return $.ajax(taskEndpoint(taskId), {
            method: "GET",
            dataType: "json"
        });
    }

  function deleteTask(taskId){
          return $.ajax(taskEndpoint(taskId), {
              method: "DELETE",
              dataType: "json"
          });
  }

    function showTaskView(task) {
        $("#readPanel .task-title").text(task.title);
        $("#readPanel .task-description").text(task.description);
    $("#readPanel").attr("task-id", task.id)
        showPanel("readPanel");

    }

  $("#readPanel .task-action-ok").click(function(){
      var title = $("#readPanel div .task-title").text();
      var description = $("#readPanel div .task-description").text();

      showPanel("updatePanel");
      $("#updatePanel input").val(title);
      $("#updatePanel textarea").val(description);
  });

  $("#updatePanel .task-action-ok").click(function(){
    var id = $("#readPanel").attr('task-id');

    $.ajax(taskEndpoint(id), {
      method: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        title: $("#updatePanel input").val(),
        description: $("#updatePanel textarea").val(),
      }),
      dataType: "json"
    }).then(function(response) {
      console.log(response);
    });

    showPanel("emptyPanel");
    reloadTasks();
  });

    function reloadTasks() {
        listTasks().then(function(response) {
            function addTaskToList(task) {
                var newItem = $("<li />");
                newItem.text(task.title);
                newItem.addClass("list-group-item");
                newItem.attr("data-task-id", task.id);
                $("#tasksList").append(newItem);
            }

            $("#tasksList").html("");
            _.forEach(response, addTaskToList);
        });
    }

    function attachHandlers() {
        $(document).on("click", "#tasksList [data-task-id]", function() {
            var taskId = $(this).attr("data-task-id");
            readTask(taskId).then(showTaskView);
        });

    $(document).on("click", "#addTaskButton", function(){
        showPanel("createPanel")
        reloadTasks();
    });

    $("#createPanel .task-action-ok").click(function(){
      var get_title = $("#createPanel input").val();
      var get_description =$("#createPanel textarea").val();

      var task = {
        title: get_title,
        description: get_description
      };
      var createPromise = $.ajax(ENDPOINT, {
        method: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(task),
        dataType: "json"
      }).then(function(response) {
        console.log(response);
        return response;
      });
    });

    $(".task-action-cancel").click(function() {
        showPanel("emptyPanel");
    });

    $(".task-action-remove").click(function() {
      var taskId = $("#readPanel").attr("task-id");
      deleteTask(taskId);
      showPanel("emptyPanel");
      reloadTasks();
        });
    }
    attachHandlers();
    reloadTasks();
});

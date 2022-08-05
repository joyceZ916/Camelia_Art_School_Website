function addSession(e) {
    e.preventDefault();

    var form = document.getElementById('addSessionForm');

    fetch("/api/sessions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_name: form.elements["session_name"].value,
            class_id: form.elements["class_id"].value,
            teacher_id: form.elements["teacher_id"].value,
            quarter: form.elements["quarter"].value,
            session_size: form.elements["session_size"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var addForm = document.getElementById('addSessionForm');
addForm.addEventListener("submit", addSession);

function updateSession(e) {
    e.preventDefault();

    var form = document.getElementById('updateSessionForm');

    fetch("/api/sessions", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: form.elements["session_id"].value,
            teacher_id: form.elements["teacher_id"].value,
            session_size: form.elements["session_size"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var updateForm = document.getElementById('updateSessionForm');
updateForm.addEventListener("submit", updateSession);


function deleteSession(e) {
    e.preventDefault();

    var form = document.getElementById('deleteSessionForm');

    fetch("/api/sessions", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: form.elements["session_id"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var deleteForm = document.getElementById('deleteSessionForm');
deleteForm.addEventListener("submit", deleteSession);
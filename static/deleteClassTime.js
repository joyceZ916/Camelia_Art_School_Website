function deleteClassTime(e) {
    e.preventDefault();

    var id = e.submitter.id

    fetch("/api/deleteClassTime", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            class_time_id: id,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var deleteForm = document.getElementById('deleteClassTime');
deleteForm.addEventListener("submit", deleteClassTime);
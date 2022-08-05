function addTeacher(e) {
    e.preventDefault();

    var form = document.getElementById('addTeacherForm');

    fetch("/api/teachers", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            f_name: form.elements["f_name"].value,
            l_name: form.elements["l_name"].value,
            email: form.elements["email"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var addForm = document.getElementById('addTeacherForm');
addForm.addEventListener("submit", addTeacher);


function addStudent(e) {
    e.preventDefault();

    var form = document.getElementById('addStudentForm');

    fetch("/api/students", {
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

var addForm = document.getElementById('addStudentForm');
addForm.addEventListener("submit", addStudent);

function updateStudent(e) {
    e.preventDefault();

    var form = document.getElementById('updateStudentForm');

    fetch("/api/students", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_id: form.elements["student_id"].value,
            email: form.elements["email"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var updateForm = document.getElementById('updateStudentForm');
updateForm.addEventListener("submit", updateStudent);
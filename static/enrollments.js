function addEnrollment(e) {
    e.preventDefault();

    var form = document.getElementById('addEnrollmentForm');

    fetch("/api/enrollments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: form.elements["session_id"].value,
            student_id: form.elements["student_id"].value,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}

var addForm = document.getElementById('addEnrollmentForm');
addForm.addEventListener("submit", addEnrollment);



function deleteEnrollment(enrollment_id) {

    fetch("/api/enrollments", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            enrollment_id: enrollment_id,
        }),
    }).then(function (response) {
        if (response.ok) {
            location.reload();
        }
    });
}
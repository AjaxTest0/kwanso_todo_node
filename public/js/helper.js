'use strict';
const base_url = window.location.origin;
const current_url = window.location.pathname.split("/");

$('document').ready(() => {
    console.log("🚀 ~ base_url>>", base_url)
    console.log("🚀 ~ current_url>>", current_url)


    $("#login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        },
    })

    $("#generateToken").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
    })

    $('#login').on('submit', function (event) {
        event.preventDefault();


        if ($("#login").valid()) {

            const email = $('#exampleInputEmail1').val();
            const password = $('#exampleInputPassword1').val();

            const formData = {
                email: email,
                password: password,
            };

            ajaxRequestPost('/api/login', formData).then((response) => {
                console.log("🚀 ~ response>>", response)
                toastr.success('This is a success message!', 'Success');
                window.location.href = '/token/list';

            }).catch((error) => {
                error = error.responseJSON
                toastr.error(error.error, error.msg);
            }).finally(() => {

            })
        }
    })

    $('#generateToken').on('submit', function (event) {
        event.preventDefault();

        const email = $('#tokenEmail').val();
        console.log("🚀 ~ email>>", email)

        if ($("#generateToken").valid()) {
            const formData = {
                email: email,
            };

            ajaxRequestPost('/api/token/v1/generate', formData).then((response) => {
                console.log("🚀 ~ response>>", response)
                toastr.success('This is a success message!', 'Success');
                window.location.href = '/token/list';

            }).catch((error) => {
                error = error.responseJSON
                toastr.error(error.error, error.msg);
            }).finally(() => {

            })
        }


    })

    $('#addTaskForm').validate({
        rules: {
            taskInput: {
                required: true,
                minlength: 1
            }
        },
        messages: {
            taskInput: {
                required: "Please enter a task",
                minlength: "Task must be at least 1 character long"
            }
        },
        submitHandler: function (form) {
            var taskText = $('#taskInput').val().trim();
            if (taskText) {
                var newTask = $(`<li class="list-group-item d-flex justify-content-between align-items-center"></li>`)
                    .html(taskText +
                        '<div>' +
                        '<button class="btn btn-warning btn-sm mr-2">Edit</button>' +
                        '<button class="btn btn-danger btn-sm">Delete</button>' +
                        '</div>'
                    );
                $('.list-group').append(newTask);
                $('#taskInput').val('');
            }
        }
    });
});

///// functions

// function showLoader() {
//     $(`#loader`).removeClass('d-none');
//     return true
// }

// function hideLoader() {
//     $(`#loader`).addClass('d-none');
//     return true
// }

function ajaxRequest(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: base_url + url,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log(url + " ajaxRequest ~ response\n\t:", response)
                resolve(response)
            },
            error: function (errorThrown) {
                console.error("ajaxRequest ~ errorThrown\n\t:", errorThrown)
                if (errorThrown.status == 401) {
                    window.location.href = '/home';
                }
                reject(errorThrown)
            }
        });
    });
}

function ajaxRequestPost(url, data) {
    console.log("ajaxRequestPost ~ url,data >>:", url, data)

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
            data: data,
            success: function (response) {
                console.log("ajaxRequestPost ~ url,data >>: ~ response\n\t:", response)
                resolve(response)
            },
            error: function (errorThrown) {
                console.error("ajaxRequestPost ~ url,data >>: ~ errorThrown\n\t:", errorThrown)
                if (errorThrown.status == 401) {
                    window.location.href = '/home';
                }
                reject(errorThrown)
            }
        });

    });
}

'use strict';


const base_url = window.location.origin;
const current_url = window.location.pathname.split("/");

$('document').ready(() => {

    console.log("🚀 ~ base_url>>", base_url)
    console.log("🚀 ~ current_url>>", current_url)
    hideLoader()
    if (current_url[1] != "") {
        ajaxRequest('/api/profile').then((response) => {
            localStorage.setItem('profile', JSON.stringify(response))
        }).catch((error) => {

        })
    }


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
            tokenEmail: {
                required: true,
                email: true
            },
        },
        messages: {
            tokenEmail: {
                required: "Please enter your email address",
                email: "Please enter a valid email address"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault();

            const email = $('#tokenEmail').val().trim();

            console.log("🚀 ~ email>>", email);

            const formData = {
                email: email,
            };
            showLoader()
            ajaxRequestPost('/api/token/v1/generate', formData)
                .then((response) => {
                    console.log("🚀 ~ response>>", response);
                    toastr.success(response.msg, 'Success');
                })
                .catch((error) => {
                    error = error.responseJSON || {};
                    toastr.error(error.error || 'An error occurred', error.msg || 'Please try again later');
                })
                .finally(() => {
                    hideLoader();
                });
        }
    });


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
                window.location.href = '/tasks/list';

            }).catch((error) => {
                error = error.responseJSON
                toastr.error(error.error, error.msg);
            }).finally(() => {

            })
        }
    })

    if (current_url[2] == "list" && current_url[1] == "tasks") {
        console.log("🚀 ~ current_url[2]>>", current_url[2])

        loadTasks()

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
            submitHandler: function (form, event) {
                event.preventDefault();
                const taskText = $('#taskInput').val().trim();
                const taskId = $('#taskId').val() ?? 0;
                const taskStatus = $('#taskStatus').val() ?? 0;
                const formData = {
                    task: taskText,
                    status: 'pending',
                    id: taskId
                }

                showLoader()

                ajaxRequestPost('/api/tasks/v1', formData).then((response) => {
                    toastr.success('Task Saved!', 'Success');

                    let newTask = $(
                        `<li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center flex-grow-1">
                                ${response.task}
                            </div>
                            <div class="mx-2">
                                <span class="badge badge-${response.status === 'completed' ? 'success' : 'warning'}">${response.status}</span>
                            </div>
                            <div>
                                <button type="button" class="btn btn-warning btn-sm mr-2 btn-edit" data-id='${response.id}' data-status='${response.status}' data-task='${response.task}'>Edit</button>
                                <button type="button" class="btn btn-danger btn-sm btn-delete" data-id='${response.id}'>Delete</button>
                            </div>
                        </li>
                        `
                    );

                    $('.list-group').append(newTask);

                }).catch((error) => {
                    error = error.responseJSON
                    toastr.error(error.error, error.msg);
                }).finally(() => {
                    $(`#taskId`).val('')
                    $(`#taskStatus`).val('')
                    $(`#taskInput`).val('')
                    loadTasks()
                })


            }

        });


        $('#list-group').on('click', '.btn-delete', function (event) {
            event.preventDefault();
            const id = $(this).attr('data-id')
            ajaxRequestDelete(`/api/tasks/v1/${id}`).then((response) => {
                toastrSuccess(response.msg)
                $(this).parent().parent().remove()
            }).catch((err) => {
                console.log("🚀 ~ err>>", err)
            }).finally(() => {

            })
        })

        $('#list-group').on('click', '.btn-edit', function (event) {
            event.preventDefault();
            console.log("edit")
            const id = $(this).attr('data-id')
            const task = $(this).attr('data-task')
            const taskStatus = $(this).attr('data-status')
            console.log("🚀 ~ id>>", id)
            console.log("🚀 ~ task>>", task)
            console.log("🚀 ~ taskStatus>>", taskStatus)
            $(`#taskId`).val(id)
            $(`#taskStatus`).val(taskStatus)
            $(`#taskInput`).val(task)
        })
    }
    let nextCursor = 1;
    let loading = false;
    $('#scroll-container').on('scroll', function () {
        let $this = $(this);
        let scrollTop = $this.scrollTop();
        let scrollHeight = $this[0].scrollHeight;
        let innerHeight = $this.innerHeight();

        if (scrollTop + innerHeight >= scrollHeight - 50) { // Adding a buffer to avoid multiple triggers
            if (!loading) {
                nextCursor++;
                fetchData(nextCursor);
            }
        }
    });
    if (current_url[2] == "tasks" && current_url[1] == "users") {
        fetchData();
        $('#search-button').on('click', function () {
            console.log('test')
            fetchData(null, $('#email-search').val(), $('#status-search').val(), false);
        });
    }




    ///// functions

    function showLoader() {
        $(`#loader`).removeClass('d-none');
        return true
    }

    function toastrSuccess(msg) {
        toastr.success(msg, 'Success');
    }
    function toastrError(msg = 'Something went wrong! Try again later') {
        toastr.error(msg, 'Error');
    }

    function hideLoader() {
        $(`#loader`).addClass('d-none');
        return true
    }

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

    function ajaxRequestDelete(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: base_url + url,
                method: 'DELETE',
                dataType: 'json',
                success: function (response) {
                    console.log(url + " ajaxRequest ~ response\n\t:", response);
                    resolve(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("ajaxRequest ~ errorThrown\n\t:", errorThrown);
                    if (jqXHR.status === 401) {
                        window.location.href = '/';
                    }
                    reject(errorThrown);
                }
            });
        });
    }


    function ajaxRequestPost(url, data) {

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


    function loadTasks() {
        const profile = JSON.parse(localStorage.getItem('profile'))
        ajaxRequest(`/api/tasks/v1/user/${profile.id}`).then((response) => {
            console.log("🚀 ~ response>>", response)

            let newTaskHtml = '';
            response.data.forEach(element => {
                const listItem = $(
                    `<li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center flex-grow-1">
                ${element.task}
            </div>
            <div class="mx-2">
                <span class="badge badge-${element.status === 'completed' ? 'success' : 'warning'}">${element.status}</span>
            </div>
            <div>
                <button type="button" class="btn btn-warning btn-sm mr-2 btn-edit" data-id='${element.id}' data-status='${element.status}' data-task='${element.task}'>Edit</button>
                <button type="button" class="btn btn-danger btn-sm btn-delete" data-id='${element.id}'>Delete</button>
            </div>
        </li>
        `
                );

                newTaskHtml += listItem.prop('outerHTML');// jq to html
            });

            $('#list-group').html(newTaskHtml);

        }).catch((error) => {

        }).finally(() => {
            hideLoader()
        })
    }
    function fetchData(cursor = 1, email = '', status = '', append = true) {
        if (loading) return;
        loading = true;

        // showLoader();
        $.ajax({
            url: `/api/tasks/v1`,
            type: 'GET',
            data: {
                cursor: cursor,
                email: $('#email-search').val(),
                status: $('#status-search').val()
            },
            success: function (response) {
                hideLoader();
                let tableBody = $('#table-body');

                if (!append) {
                    tableBody.empty();
                }

                response.data.result.tasks.forEach(task => {
                    tableBody.append(`<tr>
                        <td>${new Date(task.createdAt).toLocaleDateString()}</td>
                        <td>${task.task}</td>
                        <td>${task.status}</td>
                        <td>${task.name}</td>
                    </tr>`);
                });

                loading = false;
            },
            error: function () {
                toastrError('Error fetching tasks');
                loading = false;
                hideLoader();
            }
        });
    }

});
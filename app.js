// function getData(){
//     let response = fetch("https://localhost:7126/api/Player");
//     let data = response.json();
//     console.log(data);
// }

// getData();

let lst;
let editIndex = null;
$(document).ready(() => {
  lst = GetData();
  LoadData();
  isLoading(false);
});

$(".btn-cancel").click(function () {
  ClearInput();
  $("#title").focus();
});

$(".btn-save").click((e) => {
    isLoading(true);
  setTimeout(() => {
    if (editIndex != null) {
      UpdateData();
    } else {
      SaveData();
    }
    ClearInput();
    LoadData();
  }, 3000);
});

function GetData() {
  let lst = localStorage.getItem("blogs");
  lst = lst ? JSON.parse(lst) : [];
  return lst;
}

function LoadData() {
  $("#blogData").html("");
  lst.forEach((element, index) => {
    $("#blogData").append(`
            <tr>
              <td>${index + 1}.</td>
              <td>${element.title}</td>
              <td>${element.author}</td>
              <td>${element.content}</td>
              <td>
                <button class="btn btn-warning" onClick="Edit(${index})">Edit</button>
                <button class="btn btn-danger" onClick="Delete(${index})">Delete</button>
              </td>
            </tr>
          `);
  });
}

function ClearInput() {
  $("#title").val("");
  $("#author").val("");
  $("#content").val("");
}

function SaveData() {
  let title = $("#title").val();
  let author = $("#author").val();
  let content = $("#content").val();

  let blog = {
    title: title,
    author: author,
    content: content,
  };
  lst.push(blog);
  localStorage.setItem("blogs", JSON.stringify(lst));
  isLoading(false);
  Success("Successfully Saved!");
}

function UpdateData() {
  let title = $("#title").val();
  let author = $("#author").val();
  let content = $("#content").val();

  lst[editIndex].title = title;
  lst[editIndex].author = author;
  lst[editIndex].content = content;
  localStorage.setItem("blogs", JSON.stringify(lst));
  editIndex = null;
  isLoading(false);
  Success("Successfully Updated!");
}

function Edit(index) {
  editIndex = index;
  let blog = lst[index];
  $("#title").val(blog.title);
  $("#author").val(blog.author);
  $("#content").val(blog.content);
}

function Delete(index) {
  let result = confirmMessage(
    "Are you sure you want to delete this blog?",
    (result) => {
      if (!result) return;
      isLoading(true);
      lst.splice(index, 1);
      localStorage.setItem("blogs", JSON.stringify(lst));
      setTimeout(() => {
        isLoading(false);
        LoadData();
        Success("Successfully Deleted!");
      }, 3000);
    }
  );
}

function Success(message) {
  Swal.fire({
    title: message,
    icon: "success",
  });
}

function Error(message) {
  Swal.fire({
    title: message,
    icon: "error",
  });
}

function confirmMessage(message, callback) {
  Swal.fire({
    title: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      callback(true);
      // Swal.fire({
      //   title: "Deleted!",
      //   text: "Your file has been deleted.",
      //   icon: "success",
      // });
    }
  });
}

function isLoading(bool) {
  if (bool) {
    // Notiflix.Loading.dots();
    Notiflix.Block.dots('#mainContent', 'Loading...');
  } else {
    // Notiflix.Loading.remove();
    Notiflix.Block.remove('#mainContent');
  }
}

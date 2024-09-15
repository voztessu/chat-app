// main.js
// document.addEventListener('contextmenu', function (event) {
//   event.preventDefault();
// });

const socket = io();

const userData = JSON.parse(localStorage.getItem("userData"));
if (userData) {
  document.querySelector('.container').classList.remove('d-none')
  const titleCounts = document.querySelector(".verbal-icon-text");
  var sender_name = userData.username;
  var sender_role = userData.role;
  document.querySelector(".member span").textContent = ` ${sender_name}`;
  titleCounts.textContent = sender_role === "nv" ? "Chưa trả KQ" : "Chưa kiểm";
} else {
  window.location.href = "/login";
}
let isSearching = false;
let replyToUsername = null;
let replyToContent = null;
let replyToDateSend = null;
let replyToId = null;
const divIdLastMsg = document.querySelector(".btn-load-more ");
const unreadCounts = document.querySelector(".result-box");
const unreadCountsDropDownMenu = document.querySelector(".dropdown-menu");
const searchBox = document.querySelector("#searchBox");
const inputArea = document.getElementById("input-area");
const sendMsg = document.querySelector(".send-msg");
const chatMsg = document.querySelector("#input-msg");
const messages = document.querySelector("#chat");
const scrollButton = document.querySelector(".scrollBottom");
const divCountResultSearch = document.querySelector(".countResult");
const inputFormDuplicated = document.querySelector(".inputFormDuplicated");
const resulFormDuplicated = document.querySelector(".resulFormDuplicated");
const resultSearchSpan = divCountResultSearch
  ? divCountResultSearch.querySelector("span")
  : null;
function scrollToTarget(targetId) {
  const targetElement = document.querySelector(
    `.content[data-id="${targetId}"]`
  );
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    targetElement.classList.add("glow-effect");
    setTimeout(() => {
      targetElement.classList.remove("glow-effect");
    }, 1000);
  } else {
    console.error("Target element not found");
  }
}
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
// });

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "f") {
    event.preventDefault();
    toggleSearch();
  }
});
inputFormDuplicated.addEventListener('input', (event) => {
  if (inputFormDuplicated.value === '') {
    // Xóa nội dung của resulFormDuplicated khi trường input trống
    resulFormDuplicated.innerHTML = '';
  }
});
function highlightSearchTerm(message, term) {
  // Tạo một RegExp với từ khóa tìm kiếm
  const regex = new RegExp(`(${term})`, 'gi');
  // Thay thế từ khóa tìm kiếm bằng phiên bản có màu đỏ
  return message.replace(regex, '<span class="highlight">$1</span>');
}
inputFormDuplicated.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Ngăn form submit mặc định
    const searchTerm = inputFormDuplicated.value.trim();
    if (searchTerm.length >= 4 && searchTerm.length <= 10) {
      fetch(
        `/search-duplicated?key=${encodeURIComponent(searchTerm)}&role=${encodeURIComponent(sender_role)}`
      )
        .then((response) => response.json())
        .then((data) => {
          resulFormDuplicated.innerHTML = '';
          if (data.search_duplicated !== 0) {
            data.search_duplicated.forEach((item) => {
              const highlightedMessage = highlightSearchTerm(item.message, searchTerm);
              let replySearchContent = '';

              if (item.reply_to_id) {
                replySearchContent = `
        <div class="rounded-left" style="border-left: 3px solid #686868;box-shadow:rgba(0, 0, 0, 0.2) 1px 1.5px 1px; background: #f1f1f1; padding-left: 5px;margin-bottom: 5px;">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#212121">
                <path d="M9.277 16.221a.75.75 0 0 1-1.061 1.06l-4.997-5.003a.75.75 0 0 1 0-1.06L8.217 6.22a.75.75 0 0 1 1.061 1.06L5.557 11h7.842c1.595 0 2.81.242 3.889.764l.246.126a6.203 6.203 0 0 1 2.576 2.576c.61 1.14.89 2.418.89 4.135a.75.75 0 0 1-1.5 0c0-1.484-.228-2.52-.713-3.428a4.702 4.702 0 0 0-1.96-1.96c-.838-.448-1.786-.676-3.094-.709L13.4 12.5H5.562l3.715 3.721Z"></path>
            </svg>
            <div style="font-size:0.8rem">${highlightSearchTerm(item.reply_to_content,searchTerm)}</div>
            <div style="font-size:12px;">${formatDate(item.reply_to_date_send)}</div>
        </div>`;
              }
              const itemFormDuplicated = document.createElement('div');
              itemFormDuplicated.classList.add('itemFormDuplicated','border-bottom', 'p-2');
              itemFormDuplicated.innerHTML = `<div class="d-flex align-items-start">
</div>${replySearchContent}<div class="d-flex justify-content-start flex-column"><span class="msgFormDuplicated" style="white-space: pre-wrap;">${highlightedMessage}<span><div class="text-gray-500">${formatDate(item.date_send)}</div></div>`;
              resulFormDuplicated.appendChild(itemFormDuplicated);
            });
          } else {
            resulFormDuplicated.textContent = `Không tìm thấy tin nhắn`;
          }
        });
    } else {
      resulFormDuplicated.textContent = `Tên tài khoản không hợp lệ`;
    }
  }
});
function toggleSearch() {
  const searchForm = document.querySelector(".searchform");
  const isSearching = searchForm.classList.contains("visible");

  if (isSearching) {
    hideSearch();
  } else {
    showSearch();
  }
}


function showSearch() {
  const searchForm = document.querySelector(".searchform");
  const searchBox = document.querySelector("#searchBox");
  searchForm.classList.add("visible");
  searchBox.focus();
  isSearching = true;
  document.querySelector(".closeSearchBox").addEventListener("click", hideSearch);
}

function hideSearch() {
  const btnUp = document.querySelector('.btnUp');
  const btnDown = document.querySelector('.btnDown');
  btnUp.removeEventListener('click', handleBtnUpClick);
  btnDown.removeEventListener('click', handleBtnDownClick);
  const searchForm = document.querySelector(".searchform");
  searchForm.classList.remove("visible");
  isSearching = false; // Cập nhật trạng thái isSearching
  fetchMessages();
}

function fetchMessages() {
  fetch(`/messages?role=${encodeURIComponent(sender_role)}&name=${encodeURIComponent(sender_name)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {

      }
      messages.innerHTML = "";
      searchBox.value = "";
      divIdLastMsg.values = data[data.length - 1].id;
      data.reverse().forEach((message) => displayMessage(message));
      scrollToBottom(); // Cuộn đến cuối
      if (divCountResultSearch) {
        divCountResultSearch.classList.remove("input-group-append");
        if (resultSearchSpan) {
          resultSearchSpan.classList.remove("input-group-text");
          resultSearchSpan.textContent = "";
        }
      }
    });
}

let searchScrollIndex = -1;
let data = [];

// Event listeners
searchBox.addEventListener("input", async (e) => {
  e.preventDefault();
  const key = searchBox.value.trim();

  if (key) {
    try {
      const response = await fetch(
        `/search?role=${encodeURIComponent(sender_role)}&name=${encodeURIComponent(sender_name)}&key=${encodeURIComponent(key)}`
      );
      data = await response.json();
      searchScrollIndex = -1;
      if (divCountResultSearch) {
        divCountResultSearch.classList.add("input-group-append");
        if (resultSearchSpan) {
          resultSearchSpan.classList.add("input-group-text");
          resultSearchSpan.innerHTML = `${searchScrollIndex + 1}/${data.length}`;
        }
      }

      const btnUp = document.querySelector('.btnUp');
      const btnDown = document.querySelector('.btnDown');

      btnUp.removeEventListener('click', handleBtnUpClick);
      btnDown.removeEventListener('click', handleBtnDownClick);

      btnUp.addEventListener('click', handleBtnUpClick);
      btnDown.addEventListener('click', handleBtnDownClick);

      if (data.length > 0) {
        messages.innerHTML = "";
        data.forEach((message) => {
          // message.message = highlightedMessage(message.message,key);
          updateMessageLoadMore(message, key);
        });
      } else {
        messages.innerHTML = "Không có kết quả trùng khớp."
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  }
});

function handleBtnUpClick() {
  if (data.length > 0 && searchScrollIndex < data.length - 1) {
    searchScrollIndex += 1; // Tăng chỉ số
    const targetId = data[searchScrollIndex]?.id;

    if (targetId) {
      try {
        scrollToTarget(targetId);
        if (resultSearchSpan) {
          resultSearchSpan.innerHTML = `${searchScrollIndex + 1}/${data.length}`;
        }
      } catch (error) {
        console.error("Lỗi cuộn đến mục:", error);
      }
    }
  }
}

// Xử lý sự kiện click cho btnDown
function handleBtnDownClick() {
  if (data.length > 0 && searchScrollIndex > 0) {
    searchScrollIndex -= 1; // Giảm chỉ số
    const targetId = data[searchScrollIndex]?.id;

    if (targetId) {
      try {
        scrollToTarget(targetId);
        if (resultSearchSpan) {
          resultSearchSpan.innerHTML = `${searchScrollIndex + 1}/${data.length}`;
        }
      } catch (error) {
        console.error("Lỗi cuộn đến mục:", error);
      }
    }
  }
}
sendMsg.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});
chatMsg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (e.ctrlKey) {
      e.preventDefault();
      const cursorPosition = chatMsg.selectionStart;
      chatMsg.value = chatMsg.value.substring(0, cursorPosition) + '\n' + chatMsg.value.substring(cursorPosition);
      chatMsg.selectionStart = chatMsg.selectionEnd = cursorPosition + 1;
    } else {
      e.preventDefault();
      sendMessage();
    }
  }
});
chatMsg.addEventListener('input', () => {
  chatMsg.style.height = '40px';
  chatMsg.style.height = `${chatMsg.scrollHeight}px`;
});
function resizeTextarea() {
  chatMsg.style.height = '40px';
  chatMsg.style.overflow = 'hidden';
}
// btnLoadMore.addEventListener('click',()=>{
//     const lastMessageId = btnLoadMore.dataset.id;
//     console.log('Last message ID:', lastMessageId);
//     loadMoreMessages(lastMessageId);
// })

messages.addEventListener("scroll", checkScrollPosition);
// Start Load More
function loadMoreMessages(lastMessageId) {
  const previousScrollTop = messages.scrollTop;
  const previousScrollHeight = messages.scrollHeight;
  fetch(
    `/messages?role=${encodeURIComponent(
      sender_role
    )}&name=${encodeURIComponent(
      sender_name
    )}&lastMessageId=${encodeURIComponent(lastMessageId)}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        divIdLastMsg.values = data[data.length - 1].id;
        data.forEach((message) => updateMessageLoadMore(message, ''));
        const newScrollHeight = messages.scrollHeight;
        messages.scrollTop =
          previousScrollTop + (newScrollHeight - previousScrollHeight);
      }
    })
    .catch((error) => {
      console.error("Error loading more messages:", error);
    });
}
// End Load More
fetch(
  `/messages?role=${encodeURIComponent(sender_role)}&name=${encodeURIComponent(
    sender_name
  )}`
)
  .then((response) => response.json())
  .then((data) => {
    if (data.length > 0) {
      divIdLastMsg.values = data[data.length - 1].id;
      data.reverse().forEach((message) => displayMessage(message));
      updateUnreadCount();
      scrollToBottom();
    }
  });
function logOut() {
  localStorage.clear();
  window.location.href = "/login";
}
function updateUnreadCount() {
  fetch(
    `/unread-count?username=${encodeURIComponent(
      sender_name
    )}&role=${encodeURIComponent(sender_role)}`
  )
    .then((response) => response.json())
    .then((data) => {
      unreadCountsDropDownMenu.innerHTML = '';
      unreadCounts.textContent = data.unread_count ? data.unread_count.length : '0';
      if (data.unread_count != 0) {
        data.unread_count.forEach((item) => {
          const dropDownItem = document.createElement("div");

          dropDownItem.className = "dropdown-item border-bottom";
          dropDownItem.innerHTML = `<div class="dropDownName">${item.sender_name}</div>
        <div></div><div class="dropDownMessage">${item.message}</div><div class="dropDownTime">${formatDate(item.date_send)}</div>
        `;
          unreadCountsDropDownMenu.appendChild(dropDownItem);
          dropDownItem.addEventListener('click', function () {
            // Gọi hàm scrollToTarget và truyền ID của phần tử này
            scrollToTarget(item.id);
          });
        });
      } else {
        const dropDownItem = document.createElement("div");
        dropDownItem.className = "text-center p-2 m-2"
        dropDownItem.textContent = 'Không có tin nhắn mới...';
        unreadCountsDropDownMenu.appendChild(dropDownItem);
      }
    });
}

unreadCountsDropDownMenu.addEventListener('click', function (event) {
  if (event.target.closest('.dropdown-item')) {
    event.stopPropagation();
  }
});
function sendMessage() {
  const message = chatMsg.value.trim();
  if (message === "") {
    alert("Không được để trống");
    return;
  }
  const reply_to_username = replyToUsername || null;
  const reply_to_content = replyToContent || null;
  const reply_to_date_send = replyToDateSend || null;
  const reply_to_id = replyToId || null;
  const date_send = new Date();
  socket.emit("self-chat", {
    sender_name,
    message,
    date_send: date_send.toISOString(),
    reply_to_username,
    reply_to_content,
    reply_to_date_send,
    reply_to_id,
    role: sender_role,
  });
  chatMsg.value = "";
  replyToUsername = null;
  replyToContent = null;
  replyToDateSend = null;
  replyToId = null;
  // Optionally, update the unread count for local UI immediately if needed
  exitReply();
  resizeTextarea();
  updateUnreadCount();
}
function sendEditMessage() {
  const msgEdit = document.querySelector(".edit-input-msg");
  if (msgEdit.value.trim() === "") {
    alert("Không được để trống");
    return;
  }
  const id = msgEdit.getAttribute("edit-id");
  const content = msgEdit.value;
  content;
  socket.emit("update-chat", {
    id,
    messageEdited: content,
  });
  scrollToTarget(id);
  exitEdit();
}
function exitEdit() {
  const contentReply = document.querySelector(".contentReply");
  contentReply.innerHTML = "";
  const a = document.querySelector(".edit-input-msg");
  const b = document.querySelector(".edit-send-msg");
  if (a) {
    b.remove();
    a.remove();
  }
  sendMsg.classList.remove("d-none");
  chatMsg.classList.remove("d-none");
}
function exitReply() {
  const contentReply = document.querySelector(".contentReply");
  contentReply.innerHTML = "";
  replyToUsername = null;
  replyToContent = null;
  replyToDateSend = null;
  replyToId = null;
}
function handleReply(username, content, datesend, id) {
  replyToUsername = username;
  replyToContent = content;
  replyToDateSend = datesend;
  replyToId = id;
  const contentReply = document.querySelector(".contentReply");
  contentReply.innerHTML = `
       <img class="p-1" width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/reply.png" alt="reply"/>
        <div class="flex-grow-1 ml-3">
            <small style="color:#40a7e3">Đang trả lời ${replyToUsername}</small>
            <div class="small">${replyToContent}</div>
        </div>
        <div class="btn" onclick=exitReply()>
            <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/999999/multiply--v1.png" alt="multiply--v1" />
        </div>
    `;
  document.getElementById("input-msg").focus();
  // Sự kiện edit
  const a = document.querySelector(".edit-input-msg");
  const b = document.querySelector(".edit-send-msg");
  if (a) {
    b.remove();
    a.remove();
  }
  // Ẩn gửi tin nhắn
  sendMsg.classList.remove("d-none");
  chatMsg.classList.remove("d-none");
}
function handleEdit(id, content) {
  // Sự kiện edit
  const a = document.querySelector(".edit-input-msg");
  const b = document.querySelector(".edit-send-msg");
  if (a) {
    b.remove();
    a.remove();
  }
  // Ẩn gửi tin nhắn
  sendMsg.classList.add("d-none");
  chatMsg.classList.add("d-none");
  // Tạo sửa tin nhắn
  const editSendMsg = document.createElement("button");
  const div = document.createElement('div');
  const editChatMsg = document.createElement("textarea");
  editSendMsg.classList.add("btn", "btn-danger", "edit-send-msg");
  editSendMsg.innerHTML = `<i class="fa fa-paper-plane"
                                aria-hidden="true"></i>
                            Sửa`;
  editSendMsg.addEventListener("click", () => sendEditMessage());
  editChatMsg.classList.add("edit-input-msg", "form-control");
  editChatMsg.value = content;
  editChatMsg.setAttribute("edit-id", id);
  const contentReply = document.querySelector(".contentReply");
  contentReply.innerHTML = `
        <img class="p-1" width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/notice.png" alt="notice"/>
        <div class="flex-grow-1 ml-3">
            <small style="color:#dc3545">Đang chỉnh sửa</small>
            <div class="small">${content}</div>
        </div>
        <div class="btn" onclick=exitEdit()>
            <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/999999/multiply--v1.png" alt="multiply--v1" />
        </div>
    `;
  div.append(editSendMsg);
  inputArea.append(editChatMsg, div);
  editChatMsg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        e.preventDefault();
        const cursorPosition = editChatMsg.selectionStart;
        editChatMsg.value = editChatMsg.value.substring(0, cursorPosition) + '\n' + editChatMsg.value.substring(cursorPosition);
        editChatMsg.selectionStart = editChatMsg.selectionEnd = cursorPosition + 1;
      } else {
        e.preventDefault();
        sendEditMessage();
      }
    }
  });

  editChatMsg.addEventListener('input', () => {
    editChatMsg.style.height = '40px';
    editChatMsg.style.height = `${editChatMsg.scrollHeight}px`;
  });
  editChatMsg.focus();
}
function handleDelete(id) {
  socket.emit("delete-chat",
    { id });
}
function displayMessage(data) {
  const isSelf = sender_name === data.sender_name ? true : false;
  const replyIcon = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#212121"><path d="M9.277 16.221a.75.75 0 0 1-1.061 1.06l-4.997-5.003a.75.75 0 0 1 0-1.06L8.217 6.22a.75.75 0 0 1 1.061 1.06L5.557 11h7.842c1.595 0 2.81.242 3.889.764l.246.126a6.203 6.203 0 0 1 2.576 2.576c.61 1.14.89 2.418.89 4.135a.75.75 0 0 1-1.5 0c0-1.484-.228-2.52-.713-3.428a4.702 4.702 0 0 0-1.96-1.96c-.838-.448-1.786-.676-3.094-.709L13.4 12.5H5.562l3.715 3.721Z"></path></svg>`;
  const chatItem = document.createElement("div");
  chatItem.className = `message ${isSelf ? "self" : "other"}`;
  const replyContent = (data.reply_to_id && data.reply_to_content) ? `<div class="reply"${data.reply_to_id
    ? `onclick="scrollToTarget(${data.reply_to_id})">`
    : ""
    }${replyIcon}<div class="py-1">${data.reply_to_content
    }</div><div style="font-size:12px;">${data.reply_to_username
    }, ${formatDate(data.reply_to_date_send)}
</div></div>`: `<div class="reply">${replyIcon}<div class="py-1">Tin nhắn đã bị xóa</div></div>`;
  chatItem.innerHTML = `
        <div class='username'>
            ${!isSelf ? data.sender_name + ", " : ""} 
            <small class="timestamp">${formatDate(
    data.date_send
  )}</small></div><div class='content' data-id=${data.id}>${data.reply_to_id
    ? `${replyContent}`
    : ""
    }<span style="white-space: pre-wrap;">${data.message}</span></div>`;
  messages.appendChild(chatItem);
  const contentDiv = chatItem.querySelector(".content");
  contentDiv.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showContextMenu(e, data, isSelf);
  });
}
function updateMessageLoadMore(data, key = '') {
  const isSelf = sender_name === data.sender_name ? true : false;
  const replyIcon = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#212121"><path d="M9.277 16.221a.75.75 0 0 1-1.061 1.06l-4.997-5.003a.75.75 0 0 1 0-1.06L8.217 6.22a.75.75 0 0 1 1.061 1.06L5.557 11h7.842c1.595 0 2.81.242 3.889.764l.246.126a6.203 6.203 0 0 1 2.576 2.576c.61 1.14.89 2.418.89 4.135a.75.75 0 0 1-1.5 0c0-1.484-.228-2.52-.713-3.428a4.702 4.702 0 0 0-1.96-1.96c-.838-.448-1.786-.676-3.094-.709L13.4 12.5H5.562l3.715 3.721Z"></path></svg>`;
  const chatItem = document.createElement("div");
  chatItem.className = `message ${isSelf ? "self" : "other"}`;
  const replyContent = (data.reply_to_id && data.reply_to_content) ? `<div class="reply"${data.reply_to_id
    ? `onclick="scrollToTarget(${data.reply_to_id})">`
    : ""
    }${replyIcon}<div class="py-1">${highlightSearchTerm(data.reply_to_content, key)
    }</div><div style="font-size:12px;">${data.reply_to_username
    }, ${formatDate(data.reply_to_date_send)}
</div></div>`: `<div class="reply">${replyIcon}<div class="py-1">Tin nhắn đã bị xóa</div></div>`;
  chatItem.innerHTML = `
      <div class='username'>
          ${!isSelf ? data.sender_name + ", " : ""} 
          <small class="timestamp">${formatDate(
    data.date_send
  )}</small></div><div class='content' data-id=${data.id}>${data.reply_to_id
    ? `${replyContent}`
    : ""
    }<span style="white-space: pre-wrap;">${highlightSearchTerm(data.message, key)}</span></div>`;
  messages.prepend(chatItem);
  const contentDiv = chatItem.querySelector(".content");
  contentDiv.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showContextMenu(e, data, isSelf);
  });
}
function checkScrollPosition() {
  const { scrollHeight, clientHeight, scrollTop } = messages;
  scrollButton.style.display =
    scrollHeight - scrollTop - clientHeight > 50 ? "flex" : "none";
  if (scrollTop == 0) {
    if (!isSearching && scrollTop == 0) {
      const lastMessageId = divIdLastMsg.values;
      loadMoreMessages(lastMessageId);
    }
  }
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

socket.on("other-chat", (message) => {
  if (shouldHandleMessage(message)) {
    displayMessage(message);
    if (sender_name !== message.sender_name) {
      checkScrollPosition();
      updateUnreadCount();
    } else {
      scrollToBottom();
    }
  }
});
socket.on("chat-updated", (data) => {
  document.querySelector(`.content[data-id="${data.id}"] span`).textContent =
    data.messageEdited;
});
socket.on("chat-deleted", (data) => {
  const contentElement = document.querySelector(`.content[data-id="${data.id}"]`);

  if (contentElement) {
    const messageElement = contentElement.closest('.message');

    if (messageElement) {
      messageElement.remove();
      updateUnreadCount();
    }
  }
});
function shouldHandleMessage(message) {
  const isSenderRoleKH = sender_role === "kh";
  const isMessageFromKH =
    message.role === "kh" && message.reply_to_username === sender_name;
  const isSender = message.sender_name === sender_name;

  return isSenderRoleKH || isMessageFromKH || isSender;
}
function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "CH" : "SA";
  const hour12 = hours % 12 || 12;
  const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${timeString} ${day}/${month}`;
}

// function showContextMenu(e, data, isSelf) {
//   console.log(data);
//   const contextMenu =
//     document.getElementById("context-menu") || createContextMenu();
//   contextMenu.style.top = `${e.clientY}px`;
//   contextMenu.style.left = `${e.clientX}px`;
//   contextMenu.style.display = "block";

//   const replyOption = contextMenu.querySelector(".reply-option");
//   const editOption = contextMenu.querySelector(".edit-option");
//   replyOption.onclick = () =>
//     handleReply(data.sender_name, data.message, data.date_send, data.id);
//   if (isSelf) {
//     editOption.style.display = "block";
//     editOption.onclick = () => handleEdit(data.id, data.message);
//   } else {
//     editOption.style.display = "none";
//   }

//   document.addEventListener(
//     "click",
//     () => (contextMenu.style.display = "none"),
//     { once: true }
//   );
// }
function showContextMenu(e, data, isSelf) {
  const contextMenu =
    document.getElementById("context-menu") || createContextMenu();
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.display = "block";

  // Lấy lại dữ liệu từ phần tử hiện tại để đảm bảo đúng thông tin
  const contentDiv = document.querySelector(`.content[data-id="${data.id}"]`);
  if (contentDiv) {
    const updatedData = {
      id: data.id,
      message: contentDiv.querySelector('span').textContent,
      sender_name: data.sender_name,
      date_send: data.date_send
    };

    const replyOption = contextMenu.querySelector(".reply-option");
    const editOption = contextMenu.querySelector(".edit-option");
    const deleteOption = contextMenu.querySelector(".delete-option");
    replyOption.onclick = () =>
      handleReply(updatedData.sender_name, updatedData.message, updatedData.date_send, updatedData.id);
    if (isSelf) {
      deleteOption.classList.remove('d-none');
      editOption.classList.remove('d-none');
      editOption.onclick = () => handleEdit(updatedData.id, updatedData.message);
      deleteOption.onclick = () => {
        const confirmModal = document.getElementById('confirm-modal');
        confirmModal.style.display = "block";

        // Thêm logic xác nhận xóa
        document.getElementById('confirm-delete').onclick = () => {
          handleDelete(updatedData.id);
          confirmModal.style.display = "none";
        };

        // Hủy bỏ xóa
        document.getElementById('cancel-delete').onclick = () => {
          confirmModal.style.display = "none";
        };
      };
    } else {
      deleteOption.classList.add('d-none');
      editOption.classList.add('d-none');
    }
  }

  document.addEventListener(
    "click",
    () => (contextMenu.style.display = "none"),
    { once: true }
  );
}

function createContextMenu() {
  const menu = document.createElement("div");
  menu.id = "context-menu";
  menu.innerHTML = `
        <div class="context-menu-item reply-option">
        <img width="20" height="20" src="https://img.icons8.com/pulsar-line/48/reply.png" alt="reply"/>
<span class="pl-2">Trả lời<span></div>
        <div class="context-menu-item edit-option"><img width="20" height="20" src="https://img.icons8.com/pulsar-line/48/pencil.png" alt="pencil"/><span class="pl-2">Chỉnh sửa<span></div>
 <div class="context-menu-item delete-option"><img width="20" height="20" src="https://img.icons8.com/pulsar-line/48/delete-forever.png" alt="delete-forever"/>
<span class="pl-2">Xóa<span></div>
    `;
  document.body.appendChild(menu);
  return menu;
}
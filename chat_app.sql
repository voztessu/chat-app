-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th10 03, 2024 lúc 03:48 AM
-- Phiên bản máy phục vụ: 10.6.18-MariaDB-cll-lve
-- Phiên bản PHP: 8.1.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `chat_app`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `sender_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `reply_to_id` bigint(20) DEFAULT NULL,
  `date_send` datetime NOT NULL DEFAULT current_timestamp(),
  `is_replied` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `sender_name`, `message`, `reply_to_id`, `date_send`, `is_replied`) VALUES
(433, 'Ryo', 'SAIMY123 -IN chưa nhé', NULL, '2024-09-11 05:24:57', 1),
(434, 'Eira', '5TANQUYNH5 - R chưa nhé', NULL, '2024-09-11 05:25:06', 1),
(436, 'Eira', '729469 -S thế nào nhé', NULL, '2024-09-11 05:25:21', 1),
(437, 'Mino', 'IN LAST MONTH', 433, '2024-09-11 05:40:28', 0),
(439, 'Mino', 'N0 R', 434, '2024-09-11 05:40:54', 0),
(440, 'Mino', 'DW31	HAIDZ333	Hai', 435, '2024-09-11 05:41:18', 0),
(441, 'Mino', 'N0 IN Bình thường', 436, '2024-09-11 05:41:28', 0),
(442, 'Ryo', 'HAIDZ333 -R chưa nhé', NULL, '2024-09-11 08:38:36', 1),
(443, 'Mino', 'DW31	HUONGLINR	Thợ săn', 442, '2024-09-11 08:38:51', 1),
(448, 'Flame', 'DW31	HAIDZ333	Hai', 442, '2024-09-12 04:37:44', 0),
(449, 'Eira', 'TRUNG23018-S thế nào nhé', NULL, '2024-09-12 04:38:44', 1),
(450, 'Eira', 'ANHNHAT23-S thế nào nhé', NULL, '2024-09-12 04:38:48', 1),
(451, 'Eira', 'THE2580-S thế nào nhé', NULL, '2024-09-12 04:38:53', 1),
(452, 'Ryo', 'DUCANH6M -RE IN chưa nhé', NULL, '2024-09-12 04:40:18', 1),
(453, 'Ryo', 'CHUNGL4 -S thế nào nhé', NULL, '2024-09-12 04:40:26', 1),
(454, 'Flame', 'Không đăng nhập', 449, '2024-09-12 04:41:07', 0),
(455, 'Flame', 'NO re in', 452, '2024-09-12 04:41:18', 0),
(456, 'Flame', 'Bình thường', 451, '2024-09-12 04:41:35', 0),
(457, 'Flame', 'bình thường', 451, '2024-09-12 04:41:51', 0),
(458, 'Flame', 'bình thường', 453, '2024-09-12 04:42:01', 0),
(459, 'Flame', 'bình thường', 450, '2024-09-12 04:42:15', 0),
(460, 'Eira', 'THE2580-S thế nào nhé', NULL, '2024-09-12 04:43:53', 1),
(461, 'Flame', 'Chưa BSTT', 460, '2024-09-12 04:44:11', 0),
(462, 'Ryo', 'TUYET999E -S thế nào nhé', NULL, '2024-09-13 07:55:34', 1),
(463, 'Ryo', 'PHONGCUR - S thế nào nhé', NULL, '2024-09-13 07:55:38', 1),
(464, 'Ryo', 'KIEN6633 -S thế nào nhé', NULL, '2024-09-13 07:55:41', 1),
(465, 'Mino', 'Không đăng nhập', 462, '2024-09-13 08:05:46', 0),
(466, 'Mino', 'N0 IN Bình thường', 463, '2024-09-13 08:05:59', 0),
(467, 'Mino', 'N0 IN Bình thường', 464, '2024-09-13 08:06:08', 0),
(468, 'User1', 'saimy123 - in chưa nhé', NULL, '2024-09-13 09:25:14', 0),
(469, 'User2', 'BAODZ2K6 -S thế nào nhé', NULL, '2024-09-14 02:30:39', 0),
(470, 'User3', 'BAODZ2K6 -S thế nào nhé', NULL, '2024-09-14 02:31:54', 0),
(471, 'Ryo', 'TUYET999E -R chưa nhé', NULL, '2024-09-15 05:45:56', 0),
(472, 'Eira', 'TUYET999E -R chưa nhé', NULL, '2024-09-15 05:46:20', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('kh','nv','','') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Ryo', 'Ryo', 'nv', '2024-09-03 11:10:46'),
(2, 'Admin', 'Admin', 'kh', '2024-09-03 11:10:46'),
(3, 'Eira', 'Eira', 'nv', '2024-09-03 11:10:46'),
(4, 'Mino', 'Admin123', 'kh', '2024-09-11 12:22:06'),
(5, 'Flame', 'Admin123!@#', 'kh', '2024-09-12 09:28:02'),
(6, 'User1', 'User1', 'nv', '2024-09-13 15:19:44'),
(7, 'User2', 'User2', 'nv', '2024-09-13 15:19:44'),
(8, 'User3', 'User3', 'nv', '2024-09-13 15:19:44'),
(9, 'User4', 'User4', 'nv', '2024-09-13 15:19:44'),
(10, 'User5', 'User5', 'nv', '2024-09-13 15:19:44'),
(11, 'Admin1', 'Admin1', 'kh', '2024-09-13 15:19:44'),
(12, 'Admin2', 'Admin2', 'kh', '2024-09-13 15:19:44'),
(13, 'Admin3', 'Admin3', 'kh', '2024-09-13 15:19:44'),
(14, 'Admin4', 'Admin4', 'kh', '2024-09-13 15:19:44'),
(15, 'Admin5', 'Admin5', 'kh', '2024-09-13 15:19:44');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

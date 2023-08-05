CREATE DATABASE  IF NOT EXISTS `bytube` /*!40100 DEFAULT CHARACTER SET armscii8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bytube`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: bytube
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `cg_id` tinyint NOT NULL,
  `cg_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`cg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `c_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `c_user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `c_video_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `c_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `c_text` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_is_edited` tinyint(1) DEFAULT '0',
  `c_comment_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  KEY `comments_users_u_id_fk` (`c_user_id`),
  KEY `comments_videos_v_id_fk` (`c_video_id`),
  KEY `comments_comments_c_id_fk` (`c_comment_id`),
  CONSTRAINT `comments_comments_c_id_fk` FOREIGN KEY (`c_comment_id`) REFERENCES `comments` (`c_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_users_u_id_fk` FOREIGN KEY (`c_user_id`) REFERENCES `users` (`u_id`),
  CONSTRAINT `comments_videos_v_id_fk` FOREIGN KEY (`c_video_id`) REFERENCES `videos` (`v_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `comments_AFTER_INSERT` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
	declare count int;
    insert into `comments_answers_cache` (cac_comment_id) values (new.c_id);
	if new.c_comment_id is not null then
		select count(*) into count from `comments` where c_comment_id=new.c_comment_id;
        insert into `comments_answers_cache` (cac_comment_id, cac_answers_count) values (new.c_comment_id, count) on duplicate key update cac_answers_count=count;
	end if;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `comments_AFTER_DELETE` AFTER DELETE ON `comments` FOR EACH ROW BEGIN
	declare count int;
	if old.c_comment_id is not null then
		select count(*) into count from `comments` where c_comment_id=old.c_comment_id;
		update `comments_answers_cache` set cac_answers_count=count where cac_comment_id=old.c_comment_id;
	end if;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `comments_answers_cache`
--

DROP TABLE IF EXISTS `comments_answers_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments_answers_cache` (
  `cac_comment_id` varchar(36) NOT NULL,
  `cac_answers_count` int DEFAULT '0',
  PRIMARY KEY (`cac_comment_id`),
  CONSTRAINT `comments_answers_cache_comments_c_id_fk` FOREIGN KEY (`cac_comment_id`) REFERENCES `comments` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `l_user_id` varchar(100) NOT NULL,
  `l_video_id` varchar(100) NOT NULL,
  `l_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `likes_users_u_id_fk` (`l_user_id`),
  KEY `likes_videos_v_id_fk` (`l_video_id`),
  CONSTRAINT `likes_users_u_id_fk` FOREIGN KEY (`l_user_id`) REFERENCES `users` (`u_id`),
  CONSTRAINT `likes_videos_v_id_fk` FOREIGN KEY (`l_video_id`) REFERENCES `videos` (`v_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `s_id` varchar(100) NOT NULL,
  `s_user_id` varchar(100) NOT NULL,
  `s_key` varchar(255) NOT NULL,
  PRIMARY KEY (`s_id`),
  UNIQUE KEY `pk_s_key` (`s_key`),
  KEY `u_id` (`s_user_id`),
  CONSTRAINT `u_id` FOREIGN KEY (`s_user_id`) REFERENCES `users` (`u_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `s_user_from` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `s_user_to` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  UNIQUE KEY `subscriptions_pk` (`s_user_from`,`s_user_to`),
  KEY `subscriptions_users_u_id_fk2` (`s_user_to`),
  CONSTRAINT `subscriptions_users_u_id_fk` FOREIGN KEY (`s_user_from`) REFERENCES `users` (`u_id`),
  CONSTRAINT `subscriptions_users_u_id_fk2` FOREIGN KEY (`s_user_to`) REFERENCES `users` (`u_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `u_id` varchar(100) NOT NULL,
  `u_name` varchar(30) DEFAULT NULL,
  `u_password` varchar(100) DEFAULT NULL,
  `u_description` varchar(1000) DEFAULT NULL,
  `u_reg_date` date DEFAULT NULL,
  PRIMARY KEY (`u_id`),
  FULLTEXT KEY `users_u_name_index` (`u_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `v_id` varchar(100) NOT NULL,
  `v_user_id` varchar(100) NOT NULL,
  `v_name` varchar(100) DEFAULT NULL,
  `v_description` varchar(1000) DEFAULT NULL,
  `v_publish_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `v_views` int DEFAULT '0',
  `v_duration` int DEFAULT '0',
  `v_access` varchar(10) NOT NULL DEFAULT 'close',
  `v_category` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`v_id`),
  KEY `videos_users_u_id_fk` (`v_user_id`),
  KEY `videos_categories_cg_id_fk` (`v_category`),
  FULLTEXT KEY `videos_v_name_index` (`v_name`),
  CONSTRAINT `videos_categories_cg_id_fk` FOREIGN KEY (`v_category`) REFERENCES `categories` (`cg_id`),
  CONSTRAINT `videos_users_u_id_fk` FOREIGN KEY (`v_user_id`) REFERENCES `users` (`u_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `views`
--

DROP TABLE IF EXISTS `views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `views` (
  `view_user_id` varchar(100) NOT NULL,
  `view_video_id` varchar(100) NOT NULL,
  `view_date` date NOT NULL,
  `view_time` time NOT NULL,
  PRIMARY KEY (`view_video_id`,`view_user_id`,`view_date`),
  KEY `views_users_u_id_fk` (`view_user_id`),
  CONSTRAINT `views_users_u_id_fk` FOREIGN KEY (`view_user_id`) REFERENCES `users` (`u_id`),
  CONSTRAINT `views_videos_v_id_fk` FOREIGN KEY (`view_video_id`) REFERENCES `videos` (`v_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'bytube'
--
/*!50003 DROP FUNCTION IF EXISTS `check_access` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `check_access`(user_id varchar(36), video_id varchar(36)) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	declare access_count INT;
    select count(*) into access_count from videos where 
		(v_id=video_id AND v_access="open") 
        OR (v_id=video_id AND v_user_id=user_id);
	if access_count > 0 then
		return true;
	else
		RETURN false;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_comment`(
	in c_id varchar(36),
    in c_text varchar(1000),
    in c_video_id varchar(100),
    in c_user_id varchar(100),
    in c_comment_id varchar(36)
)
BEGIN
	start transaction;
		if c_comment_id != "0" then
			INSERT INTO `comments` (c_id, c_text, c_user_id, c_video_id, c_comment_id) values(c_id, c_text, c_user_id, c_video_id, c_comment_id);
			update `comments` set c_answers_count=c_answers_count + 1 where c_id=c_comment_id;
        else
			INSERT INTO `comments` (c_id, c_text, c_user_id, c_video_id) values(c_id, c_text, c_user_id, c_video_id);
        end if;
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_comment`(IN comment_id varchar(36))
BEGIN
	DELETE FROM comments WHERE c_id=comment_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `edit_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `edit_comment`(
	IN comment_id varchar(36),
    IN comment_text varchar(1000)
)
BEGIN
	UPDATE comments SET c_text=comment_text, c_is_edited=TRUE WHERE c_id=comment_id;
    SELECT * FROM comments WHERE c_id=comment_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-05 22:34:19

USE [master]
GO
/****** Object:  Database [YatuEdu]    Script Date: 4/2/2021 10:15:08 PM ******/
CREATE DATABASE [YatuEdu]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'YatuEdu', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.LY8838\MSSQL\DATA\YatuEdu.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'YatuEdu_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.LY8838\MSSQL\DATA\YatuEdu_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [YatuEdu] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [YatuEdu].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [YatuEdu] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [YatuEdu] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [YatuEdu] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [YatuEdu] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [YatuEdu] SET ARITHABORT OFF 
GO
ALTER DATABASE [YatuEdu] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [YatuEdu] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [YatuEdu] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [YatuEdu] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [YatuEdu] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [YatuEdu] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [YatuEdu] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [YatuEdu] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [YatuEdu] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [YatuEdu] SET  DISABLE_BROKER 
GO
ALTER DATABASE [YatuEdu] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [YatuEdu] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [YatuEdu] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [YatuEdu] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [YatuEdu] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [YatuEdu] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [YatuEdu] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [YatuEdu] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [YatuEdu] SET  MULTI_USER 
GO
ALTER DATABASE [YatuEdu] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [YatuEdu] SET DB_CHAINING OFF 
GO
ALTER DATABASE [YatuEdu] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [YatuEdu] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [YatuEdu] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [YatuEdu] SET QUERY_STORE = OFF
GO
USE [YatuEdu]
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [YatuEdu]
GO
/****** Object:  UserDefinedFunction [dbo].[sec_get_hash_simple_sha1]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2018/6/30
-- Description:	获取一个字符串的哈西值
--
-- ==========================================================================
create FUNCTION [dbo].[sec_get_hash_simple_sha1]
(
	@str_value	NVARCHAR(1024)
)
RETURNS CHAR(40)
AS
BEGIN
	-- Add datetime value plus a random string
	DECLARE @b varbinary(max);
	DECLARE @hash char(40);

	--SELECT @hash_this;
	SET @b = HASHBYTES('SHA1', @str_value);  
	SET @hash = CONVERT(VARCHAR(40), @b, 2);

	-- Return the result of the function
	RETURN @hash;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_get_object_id]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/19
-- Description: 获取不同表格中的id， 根据数日的name
--
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_get_object_id]
(
	@area			VARCHAR(32),	-- 领域
	@name			VARCHAR(64)	-- 对象名
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	IF @area = 'role'
	BEGIN
		RETURN (
			SELECT	[id]
			FROM	[dbo].[sys_sec_role]
			WHERE	[role_name] = @name
		);
	END
	
	IF @area = 'permission_scope'
	BEGIN
		RETURN (
			SELECT	[scope]
			FROM	[dbo].[sys_sec_permission_scope]
			WHERE	[name] = @name
		);
	END

	IF @area = 'permission'
	BEGIN
		RETURN (
			SELECT	[id]
			FROM	[dbo].[sys_sec_permission]
			WHERE	[permission] = @name
		);
	END

	-- GROUP
	IF @area = 'group'
	BEGIN
		RETURN (
			SELECT	[id]
			FROM	[dbo].[sys_sec_group]
			WHERE	[name] = @name
		);
	END

	-- GROUP-session
	IF @area = 'group-session'
	BEGIN
		RETURN (
			SELECT	[group_id]
			FROM	[dbo].[sys_sec_group_session]
			WHERE	[id_key] = @name
		);
	END

	-- role
	IF @area = 'role'
	BEGIN
		RETURN (
			SELECT [id]
			FROM [dbo].[sys_sec_role] 
			WHERE [role_name] = @name
		);
	END

   -- 不存在
   RETURN -1;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_get_object_id_from_sec_id]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/19
-- Description: 获取不同表格中的id， 根据数日的name
--
-- ==========================================================================
create FUNCTION [dbo].[sec_get_object_id_from_sec_id]
(
	@area			VARCHAR(32),	-- 领域
	@secId			CHAR(40)	    -- 对象security Id
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	IF @area = 'group'
	BEGIN
		RETURN (
			SELECT	[id]
			FROM	[dbo].[sys_sec_group]
			WHERE	[secId] = @secId
		);
	END
	
	IF @area = 'user'
	BEGIN
		RETURN (
			SELECT	[user_id]
			FROM	[dbo].[sys_sec_pw]
			WHERE	[sec_id] = @secId
		);
	END

   -- 不存在
   RETURN -1;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_get_sec_id_for_group]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2018/6/30
-- Description:	获取一个字符串的哈西值
--
-- ==========================================================================
create FUNCTION [dbo].[sec_get_sec_id_for_group]
(
	@gid	INT,
	@owner	BIGINT
)
RETURNS CHAR(40)
AS
BEGIN
	-- Add datetime value plus a random string
	DECLARE @b varbinary(max);
	DECLARE @hash char(40);
	DECLARE @secStr VARCHAR(128) = CONVERT(varchar(10),@gid) +  
								   CONVERT(varchar(16),@owner) + 
								   convert(varchar(25), SYSUTCDATETIME(), 121);
	DECLARE @secId CHAR(40) = (SELECT [dbo].[sec_get_hash_simple_sha1] (@secStr));

	-- Return the result of the function
	RETURN @secId;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_can_do]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/12
-- Description:	User 可以做此工作吗？ 可以则返回0， 否则返回错误码。
--
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_user_can_do]
(
	@uid			BIGINT,	-- 主角用户
	@permission		INT,	-- 所需的许可权限
	@targetOrg		INT,	-- 对象组织
	@targetGroup	INT,	-- 对象群
	@targetUser		BIGINT	-- 对象用户
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	-- 用户是否经过验证？
	IF (SELECT [dbo].[sec_user_is_authenticated] (@uid)) <> 1
	BEGIN
		RETURN 40000;
	END

   -- Admin can do everything
  IF (	SELECT 
				[role_id]
		FROM	[dbo].[sys_sec_role_for_user]
		WHERE	[user_id] = @uid) = (
			SELECT [dbo].[sec_get_object_id] ('Role', 'admin')
		)
	BEGIN
		RETURN 0;
	END
		
	RETURN 40001;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_can_do_group]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/19
-- Description:	User 可以做此工作吗？ 可以则返回0， 否则返回错误码。
--
-- ==========================================================================
create FUNCTION [dbo].[sec_user_can_do_group]
(
	@uid			BIGINT,			-- 主角用户
	@permission		VARCHAR(32),	-- 所需的许可权限
	@targetGroup	INT 			-- 对象组织
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	-- 用户是否经过验证？
	IF (SELECT [dbo].[sec_user_is_authenticated] (@uid)) <> 1
	BEGIN
		RETURN 40000;
	END

	-- 组存在吗？
	IF NOT EXISTS (
		SELECT 1
		FROM [dbo].[sys_sec_group]
		WHERE [id] = @targetGroup
	)
	BEGIN
		RETURN 40008;
	END

	-- 范围及权限验证
	DECLARE @scope TINYINT, @permId INT;
	SELECT 
			@permId = [id]
		   ,@scope = [scope]
	FROM	[dbo].[sys_sec_permission]
	WHERE	[permission] = @permission;

	-- 准许不存在
	IF (@permId IS NULL)
	BEGIN
		RETURN 40006;
	END

	-- 权限域不对
	IF (@scope <> ( SELECT [dbo].[sec_get_object_id] (
						'permission_scope',
						'group')))
	BEGIN
		RETURN 40007;
	END

	-- 检查组的membership
	DECLARE @creditRemaining INT;
	SELECT 
      @creditRemaining = [credit]
	FROM	[dbo].[sys_sec_group_member]
	WHERE	[user_id] = @uid AND
			[group_id] = @targetGroup;

	IF @creditRemaining IS NULL 
	BEGIN
		RETURN 40009;	-- 非成员 
	END

	IF @creditRemaining <= 0 
	BEGIN
		RETURN 80001;	-- 或余额不足
	END

	-- 成功
	RETURN 0;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_can_do2]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/12
-- Description:	User 可以做此工作吗？ 可以则返回0， 否则返回错误码。
--
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_user_can_do2]
(
	@uk				CHAR(40),	-- 主角用户TOKEN
	@permission		INT,		-- 所需的许可权限
	@targetOrg		INT,		-- 对象组织
	@targetGroup	INT,		-- 对象群
	@targetUser		BIGINT		-- 对象用户
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	-- 用户是否经过验证？
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@uk));
	IF @uid IS NULL
	BEGIN
		RETURN 40000;
	END

   -- 调用权限验证函数
  RETURN (SELECT [dbo].[sec_user_can_do] (
			 @uid
			,@permission
			,@targetOrg
			,@targetGroup
			,@targetUser));
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_can_do3]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/12
-- Description:	User 可以做此工作吗？ 可以则返回0， 否则返回错误码。
--
-- ==========================================================================
create FUNCTION [dbo].[sec_user_can_do3]
(
	@uid			BIGINT,			-- 主角用户
	@permissionName	varchar(32),	-- 所需的许可权限
	@targetOrg		INT,			-- 对象组织
	@targetGroup	INT,			-- 对象群
	@targetUser		BIGINT			-- 对象用户
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	-- 用户是否经过验证？
	IF (SELECT [dbo].[sec_user_is_authenticated] (@uid)) <> 1
	BEGIN
		RETURN 40000;
	END

	-- get permission id
	DECLARE @permission INT = (
		SELECT [dbo].[sec_get_object_id] ('permission', 'accept_new_user')
	);
	IF @permission IS NULL
	BEGIN
		RETURN 40006;
	END
		
	RETURN (SELECT [dbo].[sec_user_can_do] (@uid, @permission, @targetOrg, @targetGroup,@targetUser)); 
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_can_do4]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/12
-- Description:	User 可以做此工作吗？ 可以则返回0， 否则返回错误码。
--
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_user_can_do4]
(
	@uk				CHAR(40),		-- 主角用户TOKEN,
	@permissionName	varchar(32)		-- 所需的许可权限
)
RETURNS INT					-- 错误码（0 = 成功）
AS
BEGIN
	-- 用户是否经过验证？
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@uk));
	IF @uid IS NULL
	BEGIN
		RETURN 40000;
	END

	-- get permission id
	DECLARE @permission INT = (
		SELECT [dbo].[sec_get_object_id] ('permission', 'accept_new_user')
	);
	IF @permission IS NULL
	BEGIN
		RETURN 40006;
	END
		
	RETURN (SELECT [dbo].[sec_user_can_do] (@uid, @permission, NULL, NULL,NULL)); 
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_is_authenticated]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/12
-- Description:	User 经过验证吗？
--
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_user_is_authenticated]
(
	@uid	BIGINT
)
RETURNS BIT
AS
BEGIN
	-- Add datetime value plus a random string
	DECLARE @authenticated BIT = 0; 

	-- EMAIL validated?
	DECLARE @emailValidationDate DATETIME, @pw CHAR(64);
	SELECT @emailValidationDate = [email_verified_date]
	      ,@pw = [pw_hash]
		 FROM	[dbo].[sys_sec_pw]
		 WHERE	[user_id] = @uid;
	IF @pw IS NOT NULL AND 
	   LEN(@pw) = 64 AND 
	   @emailValidationDate IS NOT NULL
	BEGIN
		SET @authenticated = 1;
	END

	RETURN @authenticated;
END





GO
/****** Object:  UserDefinedFunction [dbo].[sec_user_is_authenticated2]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================
-- Author:		Lian Yang
-- Create date: 2020/12/20
-- Description:	User 经过验证吗？
-- returns: UID if verified, NULL if not verifieed
-- ==========================================================================
CREATE FUNCTION [dbo].[sec_user_is_authenticated2]
(
	@token	CHAR(40)
)
RETURNS BIGINT
AS
BEGIN
	-- Add datetime value plus a random string

	-- EMAIL validated?
	DECLARE @emailValidationDate DATETIME, @pw CHAR(64), @uid BIGINT;
	SELECT @emailValidationDate = [email_verified_date]
	      ,@pw = [pw_hash]
		  ,@uid =[user_id]
		 FROM	 [dbo].[sys_sec_pw]
		 WHERE   [sec_id] = @token;
	IF @pw IS NOT NULL AND 
	   LEN(@pw) = 64 AND 
	   @emailValidationDate IS NOT NULL AND
	   @uid IS NOT NULL
	BEGIN
		RETURN @uid;
	END

	RETURN NULL;
END





GO
/****** Object:  Table [dbo].[app_chat_session_member]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[app_chat_session_member](
	[session_id] [char](40) NOT NULL,
	[uid] [bigint] NOT NULL,
	[join_time] [datetime] NOT NULL,
	[end_time] [datetime] NULL,
 CONSTRAINT [PK_sys_chat_session_member] PRIMARY KEY CLUSTERED 
(
	[session_id] ASC,
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[app_message]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[app_message](
	[gid] [int] NOT NULL,
	[time] [datetime2](7) NOT NULL,
	[uid] [bigint] NOT NULL,
	[message_type] [tinyint] NOT NULL,
	[message_id] [bigint] NOT NULL,
 CONSTRAINT [PK_app_message] PRIMARY KEY CLUSTERED 
(
	[gid] ASC,
	[time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[app_msg_type]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[app_msg_type](
	[id] [tinyint] NOT NULL,
	[name] [varchar](32) NOT NULL,
 CONSTRAINT [PK_app_msg_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cache.chat_online_session]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cache.chat_online_session](
	[session_id] [char](40) NOT NULL,
	[user_id] [char](40) NOT NULL,
	[web_socket] [binary](8) NOT NULL,
 CONSTRAINT [PK_cache.chat_online_session] PRIMARY KEY CLUSTERED 
(
	[session_id] ASC,
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_admin_err_log]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_admin_err_log](
	[err_source] [varchar](100) NOT NULL,
	[err_type] [int] NOT NULL,
	[err_msg] [varchar](1024) NOT NULL,
	[time] [datetime2](7) NOT NULL,
	[attachment_txt] [nvarchar](1024) NULL,
	[attachment_num] [int] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_err_code]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_err_code](
	[type] [int] NOT NULL,
	[description_en] [varchar](64) NOT NULL,
	[description_cn] [nvarchar](32) NULL,
 CONSTRAINT [PK_sys_admin_err_type] PRIMARY KEY CLUSTERED 
(
	[type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group](
	[id] [int] NOT NULL,
	[secId] [char](40) NOT NULL,
	[name] [nvarchar](32) NOT NULL,
	[parent_org] [int] NOT NULL,
	[type] [tinyint] NOT NULL,
	[owner] [bigint] NOT NULL,
	[max_member_allowed] [int] NOT NULL,
	[popularity] [int] NOT NULL,
	[created] [datetime] NOT NULL,
	[open_to_new_member] [bit] NOT NULL,
 CONSTRAINT [PK_sys_sec_communication_group] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group_member]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group_member](
	[user_id] [bigint] NOT NULL,
	[group_id] [int] NOT NULL,
	[member_since] [datetime] NOT NULL,
	[credit] [int] NOT NULL,
 CONSTRAINT [PK_sys_sec_group_member] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group_session]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group_session](
	[id_key] [char](40) NOT NULL,
	[group_id] [int] NOT NULL,
	[start_time] [datetime] NOT NULL,
	[end_time] [datetime] NULL,
	[max_member_allowed] [int] NOT NULL,
	[max_minutes_allowed] [int] NOT NULL,
	[starter] [bigint] NOT NULL,
 CONSTRAINT [PK_sys_sec_group_session] PRIMARY KEY CLUSTERED 
(
	[id_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group_type]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group_type](
	[id] [tinyint] NOT NULL,
	[name] [varchar](32) NOT NULL,
 CONSTRAINT [PK_sys_sec_group_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_named_constant]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_named_constant](
	[name] [varchar](16) NOT NULL,
	[value] [int] NOT NULL,
 CONSTRAINT [PK_sys_sec_named_constant] PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_org]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_org](
	[id] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
	[signature] [varchar](256) NOT NULL,
	[parent_id] [int] NOT NULL,
	[public_facing] [bit] NOT NULL,
	[summary] [nvarchar](64) NULL,
 CONSTRAINT [PK_org] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_permission]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_permission](
	[id] [int] NOT NULL,
	[permission] [varchar](32) NOT NULL,
	[description] [nvarchar](128) NOT NULL,
	[scope] [tinyint] NULL,
 CONSTRAINT [PK_sys_sec_permission] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_permission_scope]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_permission_scope](
	[scope] [tinyint] NOT NULL,
	[name] [varchar](32) NOT NULL,
 CONSTRAINT [PK_sys_sec_permission_scope] PRIMARY KEY CLUSTERED 
(
	[scope] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_pw]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_pw](
	[user_id] [bigint] NOT NULL,
	[pw_hash] [char](64) NOT NULL,
	[sec_id] [char](40) NOT NULL,
	[last_update_date] [datetime] NOT NULL,
	[email_verified_date] [datetime] NULL,
 CONSTRAINT [PK_sys_sec_pw] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_role]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_role](
	[id] [int] NOT NULL,
	[role_name] [varchar](32) NOT NULL,
	[description] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_sys_sec_roles] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_role_for_user]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_role_for_user](
	[user_id] [bigint] NOT NULL,
	[role_id] [int] NOT NULL,
	[org_id] [int] NULL,
	[group_id] [int] NULL,
 CONSTRAINT [PK_sys_sec_role_for_user_1] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_role_permissions]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_role_permissions](
	[role_id] [int] NOT NULL,
	[permission_id] [int] NOT NULL,
 CONSTRAINT [PK_sys_sec_role_permissions] PRIMARY KEY CLUSTERED 
(
	[role_id] ASC,
	[permission_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_user]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_user](
	[id] [bigint] IDENTITY(100000,1) NOT NULL,
	[login_name] [nvarchar](50) NOT NULL,
	[email] [varchar](64) NOT NULL,
	[first_name] [nvarchar](32) NOT NULL,
	[last_name] [nvarchar](32) NOT NULL,
	[join_date] [datetime] NOT NULL,
 CONSTRAINT [PK_sys_sec_user] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[app_chat_session_member] ([session_id], [uid], [join_time], [end_time]) VALUES (N'5C1B64659EB2970BE4A104A90A2C6476CADF1D49', 0, CAST(N'2021-03-29T02:34:02.773' AS DateTime), CAST(N'2021-03-29T02:35:03.400' AS DateTime))
INSERT [dbo].[app_chat_session_member] ([session_id], [uid], [join_time], [end_time]) VALUES (N'D6AF98C0DEF9415D258A9B3AC8A70D4D87B0BA42', 0, CAST(N'2020-12-20T22:27:56.593' AS DateTime), CAST(N'2020-12-20T22:40:21.767' AS DateTime))
INSERT [dbo].[app_chat_session_member] ([session_id], [uid], [join_time], [end_time]) VALUES (N'D6AF98C0DEF9415D258A9B3AC8A70D4D87B0BA42', 1, CAST(N'2020-12-20T22:30:16.267' AS DateTime), CAST(N'2020-12-20T22:36:40.017' AS DateTime))
INSERT [dbo].[app_msg_type] ([id], [name]) VALUES (1, N'text')
INSERT [dbo].[app_msg_type] ([id], [name]) VALUES (2, N'icon')
INSERT [dbo].[app_msg_type] ([id], [name]) VALUES (3, N'small_video')
INSERT [dbo].[app_msg_type] ([id], [name]) VALUES (4, N'mdium_video')
INSERT [dbo].[app_msg_type] ([id], [name]) VALUES (5, N'video_link')
INSERT [dbo].[sys_admin_err_log] ([err_source], [err_type], [err_msg], [time], [attachment_txt], [attachment_num]) VALUES (N'[sys_sec_user_register_with_name', 1, N' Exception caught on line number 49.  Error Message: Cannot insert the value NULL into column ''id'', table ''YatuEdu.dbo.sys_sec_user''; column does not allow nulls. INSERT fails.Error Number:[515] Context: Failed to register user', CAST(N'2020-12-12T21:06:42.2614950' AS DateTime2), NULL, 515)
INSERT [dbo].[sys_admin_err_log] ([err_source], [err_type], [err_msg], [time], [attachment_txt], [attachment_num]) VALUES (N'[app_leave_video_conf_now]', 1, N' Exception caught on line number 0.  Error Message: Error converting data type char to int.Error Number:[8114] Context: Failed to leave video con', CAST(N'2020-12-20T22:32:26.5962430' AS DateTime2), NULL, 8114)
INSERT [dbo].[sys_admin_err_log] ([err_source], [err_type], [err_msg], [time], [attachment_txt], [attachment_num]) VALUES (N'[security]', 1, N' Exception caught on line number -1.  Error Message: Application error Error Number:[*] Context: invalid email 592591919@qq.com', CAST(N'2021-01-19T08:10:50.8446476' AS DateTime2), NULL, 20101210)
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40000, N'Unauthenticated user', N'用户没有经过验证')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40001, N'Unauthorized access', N'用户无操作权限')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40002, N'Unknown email address', N'邮箱用户不存在')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40003, N'Password is wrong', N'密码错误')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40004, N'This email address  is already registered', N'邮箱用户已经注册')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40005, N'This login name has been used by another user', N'用户名已被经注册')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40006, N'Invalid permission name', N'权限不存在')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40007, N'Invalid permission scope', N'权限域不对')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40008, N'Invalid group ID', N'组ID无效')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40009, N'Not a group member', N'非组成员')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40010, N'Invalid User Name', N'用户名不存在')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40011, N'Invalid group name', N'组名无效')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40012, N'Group not open for joining', N'群已关闭会员')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40013, N'User already in the group', N'用户已经是群成员')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (50000, N'Invalid token', N'Token 无效（安全事故）')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (80001, N'Not enough fund', N'余额不足')
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (0, N'B8EBE18FD031A4E13EDF4A129BC1F2DAAAAFD772', N'Yatu', 0, 101, 0, 10, 1, CAST(N'2020-12-01T00:00:00.000' AS DateTime), 0)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (1, N'81849A519BBD77A728BB605D469E776B0EF20126', N'Fight for Trump', 0, 102, 0, 1000, 1, CAST(N'2020-01-20T00:00:00.000' AS DateTime), 1)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (2, N'1A60EA2F36106034B88E8CE1A0F28841492EEF3B', N'云商技术讨论', 0, 102, 100001, 100, 10, CAST(N'2021-03-13T00:00:00.000' AS DateTime), 1)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (3, N'76ABBDD07C1576DF712266204C513672F6420D0E', N'天涯社群', 0, 101, 1, 1000, 5, CAST(N'2021-03-14T18:29:47.953' AS DateTime), 1)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (4, N'9EB1CF6C090BECB2CA620C1CEEFE2A4F1289F144', N'计算机程序设计讨论群', 0, 101, 2, 20, 3, CAST(N'2021-03-14T00:00:00.000' AS DateTime), 1)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (5, N'A881869E4022D743A20A231100595706827B3A22', N'海内存知己', 0, 101, 100000, 20, 8, CAST(N'2021-03-14T18:43:15.770' AS DateTime), 1)
INSERT [dbo].[sys_sec_group] ([id], [secId], [name], [parent_org], [type], [owner], [max_member_allowed], [popularity], [created], [open_to_new_member]) VALUES (6, N'BDC5D03548DAABF5EB87BE75E03EA61A795F70C0', N'微软故人群', 0, 102, 3, 100, 2, CAST(N'2021-03-14T18:45:50.947' AS DateTime), 1)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (0, 0, CAST(N'2020-12-01T00:00:00.000' AS DateTime), 10000)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (0, 1, CAST(N'2021-03-21T19:23:29.617' AS DateTime), 0)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (1, 0, CAST(N'2020-12-01T00:00:00.000' AS DateTime), 10000)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (2, 0, CAST(N'2020-12-01T00:00:00.000' AS DateTime), 10000)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (2, 3, CAST(N'2021-03-27T17:52:46.030' AS DateTime), 1)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (100000, 1, CAST(N'2021-01-21T03:22:47.703' AS DateTime), 1000)
INSERT [dbo].[sys_sec_group_member] ([user_id], [group_id], [member_since], [credit]) VALUES (100001, 1, CAST(N'2021-04-03T05:08:27.020' AS DateTime), 0)
INSERT [dbo].[sys_sec_group_session] ([id_key], [group_id], [start_time], [end_time], [max_member_allowed], [max_minutes_allowed], [starter]) VALUES (N'5C1B64659EB2970BE4A104A90A2C6476CADF1D49', 0, CAST(N'2021-03-29T02:34:02.773' AS DateTime), CAST(N'2021-03-29T02:35:03.400' AS DateTime), 10, 60, 0)
INSERT [dbo].[sys_sec_group_session] ([id_key], [group_id], [start_time], [end_time], [max_member_allowed], [max_minutes_allowed], [starter]) VALUES (N'D6AF98C0DEF9415D258A9B3AC8A70D4D87B0BA42', 0, CAST(N'2020-12-20T22:27:56.593' AS DateTime), CAST(N'2020-12-20T22:40:21.767' AS DateTime), 10, 60, 0)
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (102, N'chat_group')
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (100, N'edu_class')
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (103, N'news_group')
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (0, N'system_group')
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (101, N'vedio_conf ')
INSERT [dbo].[sys_sec_group_type] ([id], [name]) VALUES (99, N'video_and_whiteboard_class')
INSERT [dbo].[sys_sec_named_constant] ([name], [value]) VALUES (N'undefined', 2000)
INSERT [dbo].[sys_sec_org] ([id], [name], [signature], [parent_id], [public_facing], [summary]) VALUES (0, N'yatu', N'0', 0, 0, N'Yatu System')
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (1, N'assign_role', N'admin assign roles to user', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (2, N'manage_money', N'accountant manages money', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (3, N'create_org', N'admin create organization', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (4, N'manage_global_content', N'sys content manager can censor application wide content', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (5, N'accept_new_user', N'accept new user to the system ', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (101, N'assign_org_role', N'orgadmin can assign roles locally within her org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (102, N'manage_org_money', N'orgadin can manage money locally within her org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (103, N'create_sub_org', N'orgadmin can create sub org within her own org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (300, N'create_content', N'content creater creates content', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (301, N'manage_content', N'content manager manages (edit, delete, etc) content', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (302, N'approve_content', N'content manager can approve content to be published', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (500, N'manage_grouop', N'group manager can monitor, remove, close, and etc a group', 2)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (501, N'manage-group_content', N'group content manger manges content within a group', 2)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (502, N'participate_group', N'join, leave, speak, in a group', 2)
INSERT [dbo].[sys_sec_permission_scope] ([scope], [name]) VALUES (0, N'system')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [name]) VALUES (1, N'organization')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [name]) VALUES (2, N'group')
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (0, N'891a7230996035f676b53e67e87653710d01559934a97407e98f9b3ce19e0056', N'17812FFCE3D72468094A6C1AF58E6847F79E0800', CAST(N'2020-12-06T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (1, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', N'17812FFCE3D72468094A6C1AF58E6847F79E0801', CAST(N'2020-12-01T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (2, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', N'17812FFCE3D72468094A6C1AF58E6847F79E0802', CAST(N'2020-12-01T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (3, N'6829c3a061061ef0ea5169b76695f6ee8590e92443127621797edd03fa6363ae', N'17812FFCE3D72468094A6C1AF58E6847F79E0803', CAST(N'2020-12-09T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (4, N'6829c3a061061ef0ea5169b76695f6ee8590e92443127621797edd03fa6363ae', N'17812FFCE3D72468094A6C1AF58E6847F79E0804', CAST(N'2020-12-09T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (100000, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', N'17812FFCE3D72468094A6C1AF58E6847F79E0805', CAST(N'2020-12-12T21:07:49.630' AS DateTime), CAST(N'2021-01-19T08:39:26.630' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [sec_id], [last_update_date], [email_verified_date]) VALUES (100001, N'891a7230996035f676b53e67e87653710d01559934a97407e98f9b3ce19e0056', N'17812FFCE3D72468094A6C1AF58E6847F79E0809', CAST(N'2020-12-20T19:10:41.450' AS DateTime), CAST(N'2020-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (0, N'public', N'user with no special roles')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (9, N'group_manager', N'group manager to manage group related data')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (99, N'org_content_man', N'content manager for the application')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (100, N'orgadmin', N'admin who is responsible for an org')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (800, N'sys_content_man', N'system content manager')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (900, N'accountant', N'accontant who can do clearing for users payment')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (1000, N'admin', N'system admin who can create user and org and assign roles')
INSERT [dbo].[sys_sec_role_for_user] ([user_id], [role_id], [org_id], [group_id]) VALUES (0, 1000, 0, NULL)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (9, 500)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (9, 501)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (99, 301)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 101)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 102)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 103)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (800, 4)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (900, 2)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 1)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 2)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 3)
SET IDENTITY_INSERT [dbo].[sys_sec_user] ON 

INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (0, N'ly8838                          ', N'ly8838@gmail.com', N'Lian                           ', N'Yang                            ', CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (1, N'goofyluo                        ', N'goofyluo@hotmail.com', N'Gao-xiang                      ', N'Luo                             ', CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (2, N'ChenLiLi                        ', N'dndshantaram@hotmail.com', N'Li-li                          ', N'Chen                            ', CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (3, N'markayang                       ', N'markayang@icloud.com', N'Mark Anren                     ', N'Yang                            ', CAST(N'2020-01-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (4, N'AntonioYang                     ', N'cheecheewabee@gmail.com', N'Antonio Lian                   ', N'Yang                            ', CAST(N'2020-01-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (100000, N'gaojuan91                       ', N'592591919@qq.com', N'Juan', N'Gao', CAST(N'2020-12-12T21:07:49.630' AS DateTime))
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (100001, N'ey1976                          ', N'eurasiaella@gmail.com', N'Ella', N'Yan', CAST(N'2020-12-20T19:10:41.450' AS DateTime))
SET IDENTITY_INSERT [dbo].[sys_sec_user] OFF
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_group_NAME_UK]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_group_NAME_UK] ON [dbo].[sys_sec_group]
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_group_uk_sec]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_group_uk_sec] ON [dbo].[sys_sec_group]
(
	[secId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_sys_sec_group_session_group]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_group_session_group] ON [dbo].[sys_sec_group_session]
(
	[group_id] DESC,
	[start_time] DESC
)
INCLUDE ( 	[end_time]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_group_name_uk]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_group_name_uk] ON [dbo].[sys_sec_group_type]
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_permission_uk]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_permission_uk] ON [dbo].[sys_sec_permission]
(
	[permission] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_id]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_id] ON [dbo].[sys_sec_pw]
(
	[sec_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_role_name]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_role_name] ON [dbo].[sys_sec_role]
(
	[role_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_email_uk]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_email_uk] ON [dbo].[sys_sec_user]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_user_name_uk]    Script Date: 4/2/2021 10:15:09 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_user_name_uk] ON [dbo].[sys_sec_user]
(
	[login_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[sys_admin_err_log] ADD  CONSTRAINT [DF_sys_admin_err_log_attachment_txt]  DEFAULT (' ') FOR [attachment_txt]
GO
ALTER TABLE [dbo].[sys_admin_err_log] ADD  CONSTRAINT [DF_sys_admin_err_log_attachment_num]  DEFAULT ((0)) FOR [attachment_num]
GO
ALTER TABLE [dbo].[sys_sec_group] ADD  CONSTRAINT [DF_sys_sec_communication_group_max_member_allowed]  DEFAULT ((-1)) FOR [max_member_allowed]
GO
ALTER TABLE [dbo].[sys_sec_group] ADD  CONSTRAINT [DF_sys_sec_group_populaity]  DEFAULT ((1)) FOR [popularity]
GO
ALTER TABLE [dbo].[sys_sec_group] ADD  CONSTRAINT [DF_sys_sec_group_open_to_new_member]  DEFAULT ((1)) FOR [open_to_new_member]
GO
ALTER TABLE [dbo].[sys_sec_group_member] ADD  CONSTRAINT [DF_sys_sec_group_member_credit]  DEFAULT ((0)) FOR [credit]
GO
ALTER TABLE [dbo].[sys_sec_group_session] ADD  CONSTRAINT [DF_sys_sec_group_session_max_member_allowed]  DEFAULT ((10)) FOR [max_member_allowed]
GO
ALTER TABLE [dbo].[sys_sec_group_session] ADD  CONSTRAINT [DF_sys_sec_group_session_max_minutes_allowed]  DEFAULT ((60)) FOR [max_minutes_allowed]
GO
ALTER TABLE [dbo].[sys_sec_org] ADD  CONSTRAINT [DF_org_parent_id]  DEFAULT ((0)) FOR [parent_id]
GO
ALTER TABLE [dbo].[sys_sec_org] ADD  CONSTRAINT [DF_org_public_facing]  DEFAULT ((0)) FOR [public_facing]
GO
ALTER TABLE [dbo].[app_chat_session_member]  WITH CHECK ADD  CONSTRAINT [FK_app_chat_session_member_sid] FOREIGN KEY([session_id])
REFERENCES [dbo].[sys_sec_group_session] ([id_key])
GO
ALTER TABLE [dbo].[app_chat_session_member] CHECK CONSTRAINT [FK_app_chat_session_member_sid]
GO
ALTER TABLE [dbo].[app_chat_session_member]  WITH CHECK ADD  CONSTRAINT [FK_app_chat_session_member_uid] FOREIGN KEY([uid])
REFERENCES [dbo].[sys_sec_user] ([id])
GO
ALTER TABLE [dbo].[app_chat_session_member] CHECK CONSTRAINT [FK_app_chat_session_member_uid]
GO
ALTER TABLE [dbo].[app_message]  WITH CHECK ADD  CONSTRAINT [FK_app_message_app_message] FOREIGN KEY([gid], [time])
REFERENCES [dbo].[app_message] ([gid], [time])
GO
ALTER TABLE [dbo].[app_message] CHECK CONSTRAINT [FK_app_message_app_message]
GO
ALTER TABLE [dbo].[sys_sec_group]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_org] FOREIGN KEY([parent_org])
REFERENCES [dbo].[sys_sec_org] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group] CHECK CONSTRAINT [FK_sys_sec_group_org]
GO
ALTER TABLE [dbo].[sys_sec_group]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_type] FOREIGN KEY([type])
REFERENCES [dbo].[sys_sec_group_type] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group] CHECK CONSTRAINT [FK_sys_sec_group_type]
GO
ALTER TABLE [dbo].[sys_sec_group_member]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_member_group] FOREIGN KEY([group_id])
REFERENCES [dbo].[sys_sec_group] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group_member] CHECK CONSTRAINT [FK_sys_sec_group_member_group]
GO
ALTER TABLE [dbo].[sys_sec_group_member]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_member_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[sys_sec_user] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group_member] CHECK CONSTRAINT [FK_sys_sec_group_member_user]
GO
ALTER TABLE [dbo].[sys_sec_group_session]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_session_gid] FOREIGN KEY([group_id])
REFERENCES [dbo].[sys_sec_group] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group_session] CHECK CONSTRAINT [FK_sys_sec_group_session_gid]
GO
ALTER TABLE [dbo].[sys_sec_group_session]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_group_session_group_id] FOREIGN KEY([group_id])
REFERENCES [dbo].[sys_sec_group] ([id])
GO
ALTER TABLE [dbo].[sys_sec_group_session] CHECK CONSTRAINT [FK_sys_sec_group_session_group_id]
GO
ALTER TABLE [dbo].[sys_sec_org]  WITH CHECK ADD  CONSTRAINT [FK_org_parent] FOREIGN KEY([parent_id])
REFERENCES [dbo].[sys_sec_org] ([id])
GO
ALTER TABLE [dbo].[sys_sec_org] CHECK CONSTRAINT [FK_org_parent]
GO
ALTER TABLE [dbo].[sys_sec_permission]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_permission_scope] FOREIGN KEY([scope])
REFERENCES [dbo].[sys_sec_permission_scope] ([scope])
GO
ALTER TABLE [dbo].[sys_sec_permission] CHECK CONSTRAINT [FK_sys_sec_permission_scope]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_for_user_group] FOREIGN KEY([group_id])
REFERENCES [dbo].[sys_sec_group] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [FK_sys_sec_role_for_user_group]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_for_user_org] FOREIGN KEY([org_id])
REFERENCES [dbo].[sys_sec_org] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [FK_sys_sec_role_for_user_org]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_for_user_role] FOREIGN KEY([role_id])
REFERENCES [dbo].[sys_sec_role] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [FK_sys_sec_role_for_user_role]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_for_user_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[sys_sec_user] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [FK_sys_sec_role_for_user_user]
GO
ALTER TABLE [dbo].[sys_sec_role_permissions]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_permissions_permission] FOREIGN KEY([permission_id])
REFERENCES [dbo].[sys_sec_permission] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_permissions] CHECK CONSTRAINT [FK_sys_sec_role_permissions_permission]
GO
ALTER TABLE [dbo].[sys_sec_role_permissions]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_permissions_role] FOREIGN KEY([role_id])
REFERENCES [dbo].[sys_sec_role] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_permissions] CHECK CONSTRAINT [FK_sys_sec_role_permissions_role]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [CK_sys_sec_role_for_user_check_org] CHECK  (([org_id] IS NULL AND [group_id] IS NOT NULL OR [org_id] IS NOT NULL AND [group_id] IS NULL))
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [CK_sys_sec_role_for_user_check_org]
GO
/****** Object:  StoredProcedure [dbo].[app_chat_leave_video_conf_now_Internal]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/9/2020>
-- Description:	<Member of a group leave a video conf>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_leave_video_conf_now_Internal]
	@userId		BIGINT, 
	@groupId	INT,
	@sessionId	CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- 参数验证
	DECLARE @gid INT, @endTime DATETIME;
	SELECT  @gid = [group_id]
		   ,@endTime = [end_time]
	FROM    [dbo].[sys_sec_group_session]
	WHERE   [id_key] = @sessionId;
	IF @gid <> @groupId
	BEGIN
		SELECT 40008 AS err_code;
		RETURN;
	END

	-- 是否已经结束？ 如此， 则返回
	IF @endTime IS NOT NULL
	BEGIN
		SELECT 0;
		RETURN;
	END

	-- 撤出视频会议SESSION
	DECLARE @now DATETIME = SYSUTCDATETIME();
		
	-- 用户离开视频会议
	UPDATE [dbo].[app_chat_session_member]
		SET [end_time] = @now
	WHERE [session_id] = @sessionId AND
		         [uid] = @userId;

	-- session 已经结束？
	IF NOT EXISTS (
		SELECT 1
		FROM   [dbo].[app_chat_session_member]
		WHERE  [session_id] = @sessionId AND
			   [end_time] IS NULL
	)
	BEGIN
		UPDATE [dbo].[sys_sec_group_session]
			SET [end_time] = @now
		WHERE [id_key] = @sessionId;
	END

	-- 返回成功
	SELECT 0 AS err_code;
END

GO
/****** Object:  StoredProcedure [dbo].[app_chat_leave_video_conf_now_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/20/2020>
-- Description:	<Member of a group leave a video conf>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_leave_video_conf_now_MS]
	@usertToken	CHAR(40), 
	@sessionId	CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- Group Name 转 Id
	DECLARE @gid INT = (SELECT [dbo].[sec_get_object_id] ('group-session', @sessionId));
	IF @gid IS NULL
	BEGIN
		SELECT 40011 AS err_code;
		RETURN 40011;  -- 严重安全事故
	END

	-- Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 权限验证
	DECLARE @errCode INT = (
		SELECT [dbo].[sec_user_can_do_group] (
			 @uid	
			,'participate_group'
			,@gid)
	);
	IF @errCode > 0 
	BEGIN
		SELECT @errCode;
		RETURN @errCode;
	END

	-- call 内部SP
	BEGIN TRY
		BEGIN TRAN

		-- 执行内部SP
		EXECUTE @RC = [dbo].[app_chat_leave_video_conf_now_Internal] 
			 @uid
			,@gid
			,@sessionId;

		-- 事务提交
		COMMIT TRAN;
	END TRY
	BEGIN CATCH
	    -- roll back in if needed
		IF XACT_STATE() <> 0 ROLLBACK;

		-- better error handling
		DECLARE	@errSrc VARCHAR(32) = '[app_leave_video_conf_now]';
		DECLARE	@errMsg VARCHAR(1024) = 'Failed to leave video con';
		EXEC @rc = [dbo].[sys_handle_exception] @errSrc, @errMsg;
		SELECT @rc AS err_code;
	END CATCH 
END

GO
/****** Object:  StoredProcedure [dbo].[app_chat_my_group_get_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/20/2020>
-- Description:	<Obtain all the group names for which
--               I am a member with>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_my_group_get_MS]
	@usertToken	CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 返回我的组名
	SELECT 
      g.secId
	  ,g.name
      ,[member_since]
      ,[credit]
	FROM [dbo].[sys_sec_group_member] m
		JOIN [dbo].[sys_sec_group] g 
		  ON m.group_id = g.id
	WHERE [user_id] = @uid;

END

GO
/****** Object:  StoredProcedure [dbo].[app_chat_public_group_get_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/20/2020>
-- Description:	<Obtain all the group names for which
--               I am not a member with and it is public>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_public_group_get_MS]
	@usertToken	CHAR(40),
	@top		INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- Top x PUBLIC GROUP
	SELECT top(@top) [secId]
      ,[name]
      ,[parent_org]
      ,[type]
      ,[owner]
      ,[max_member_allowed]
      ,[created]
      ,[open_to_new_member]
	FROM [dbo].[sys_sec_group] g
	WHERE [open_to_new_member] = 1 AND [owner] <> @uid
			AND NOT EXISTS (
			SELECT 1
			FROM [dbo].[sys_sec_group_member] m
			WHERE m.[user_id] = @uid AND  m.group_id = g.id
		)
	ORDER BY [popularity] desc
END

GO
/****** Object:  StoredProcedure [dbo].[app_chat_start_video_conf_now_Internal]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/9/2020>
-- Description:	<Member of a group start a video conf>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_start_video_conf_now_Internal]
	@userId		BIGINT, 
	@groupId	INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0, @isNewSession BIT = 0;

	-- 是否已经开始？ 如此， 则加入会议
	DECLARE @sessionId CHAR(40), @endTime DATETIME;
	SELECT TOP(1)
		 @sessionId = [id_key]
		,@endTime   = [end_time]
	FROM  [dbo].[sys_sec_group_session] WITH (UPDLOCK) -- lock the group for updating
	WHERE [group_id] = @groupId
	ORDER BY [start_time] DESC;
		
	DECLARE @now DATETIME = SYSUTCDATETIME();

	-- 该组无活跃 SESSION, 开始会议
	IF @sessionId IS NULL OR @endTime IS NOT NULL
	BEGIN	
		-- 产生一个随机的会话 session id
		DECLARE @sessChar VARCHAR(256) = (SELECT [name]
										  FROM [dbo].[sys_sec_group]
										  WHERE [id] =  @groupId ) +
										 convert(varchar(25), SYSUTCDATETIME(), 121);
		SET @sessionId = (SELECT [dbo].[sec_get_hash_simple_sha1] (@sessChar));
		 		
		-- 开启视频会议
		INSERT INTO [dbo].[sys_sec_group_session]
			([id_key]
			,[group_id]
			,[starter]
			,[start_time]
			,[end_time])
		VALUES
			(@sessionId
			,@groupId
			,@userId
			,@now
			,NULL);

		SET @isNewSession = 1;
	END

	-- session 已经开始， 该用户如果不在里面则加入会议
	IF @isNewSession = 1 OR NOT EXISTS (
		SELECT 1
		FROM   [dbo].[app_chat_session_member]
		WHERE  [session_id] = @sessionId AND
			   [uid] = @userId
	)
	BEGIN
		INSERT INTO [dbo].[app_chat_session_member]
			([session_id]
			,[uid]
			,[join_time]
			,[end_time])
		VALUES
			(@sessionId
			,@userId
			,@now
			,NULL);
	END

	-- 返回成功
	SELECT 0 AS err_code, @sessionId AS session_id, @isNewSession AS is_new_session;
END

GO
/****** Object:  StoredProcedure [dbo].[app_chat_start_video_conf_now_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/9/2020>
-- Description:	<Member of a group start a video conf>
-- =============================================
CREATE PROCEDURE [dbo].[app_chat_start_video_conf_now_MS]
	@usertToken	CHAR(40), 
	@groupSecId	CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- MAKE SURE GROUP ID EXISTS
	DECLARE @groupId int = (
		SELECT [dbo].[sec_get_object_id_from_sec_id] ('group', @groupSecId)
	);


	IF @groupId IS NULL
	BEGIN
		SELECT 40008 AS err_code;
		RETURN 40008;  -- 严重安全事故
	END


	-- Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 权限验证
	DECLARE @errCode INT = (
		SELECT [dbo].[sec_user_can_do_group] (
			 @uid	
			,'participate_group'
			,@groupId)
	);
	IF @errCode > 0 
	BEGIN
		SELECT @errCode;
		RETURN @errCode;  
	END

	-- 一人同时只能进入或启动一个视频会议SESSION
	BEGIN TRY
		BEGIN TRAN

		-- 执行内部SP
		EXECUTE @RC = [dbo].[app_chat_start_video_conf_now_Internal] 
			 @uid
			,@groupId;

		-- 事务提交
		COMMIT TRAN;
	END TRY
	BEGIN CATCH
	    -- roll back in if needed
		IF XACT_STATE() <> 0 ROLLBACK;

		-- better error handling
		DECLARE	@errSrc VARCHAR(32) = '[app_start_video_conf_now]';
		DECLARE	@errMsg VARCHAR(1024) = 'Failed to start video con';
		EXEC @rc = [dbo].[sys_handle_exception] @errSrc, @errMsg;
		SELECT @rc AS err_code;
	END CATCH 
END

GO
/****** Object:  StoredProcedure [dbo].[app_group_owner_approve_user_as_member_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <3/27/2021>
-- Description:	<群主。批准某用户入群>
--
-- =============================================
CREATE PROCEDURE [dbo].[app_group_owner_approve_user_as_member_MS]
	@usertToken		 CHAR(40), 
	@targetUserToken CHAR(40),
	@giveCredit		 INT,
	@groupSecId		CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- Group Id 检验
	DECLARE @groupId int = (
		SELECT [dbo].[sec_get_object_id_from_sec_id] ('group', @groupSecId)
	);

	IF @groupId IS NULL
	BEGIN
		SELECT 40008 AS err_code;
		RETURN 40008;  -- 严重安全事故
	END

	DECLARE @uidOwner BIGINT =  (
		SELECT [owner]
		FROM   [dbo].[sys_sec_group]
		WHERE [id] = @groupId);
	IF (@uidOwner IS NULL)
	BEGIN
		SELECT 40011 AS err_code;
		RETURN 40011;  -- 严重安全事故
	END

	-- 用户 1 Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 用户 2 Token 转 Id
	DECLARE @uidTgt BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@targetUserToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END
	
	-- 用户1 权限检验
	IF (@uidOwner <> @uid) 
	BEGIN
		SELECT 40001 AS err_code;
		RETURN 40001;  -- 严重安全事故
	END

	-- 是否已经是群组员
	DECLARE @cedit INT = (
		SELECT [credit]
		FROM   [dbo].[sys_sec_group_member]
		WHERE  [user_id] = @uidTgt AND [group_id] = @groupId
	)
	IF (@cedit IS NULL) 
	BEGIN 
		SELECT 40009 AS err_code;
		RETURN 40009; 
	END

	-- 批准  
	IF (@cedit = 0)
	BEGIN
		UPDATE [dbo].[sys_sec_group_member]
			SET [credit] = @giveCredit
		WHERE [user_id] = @uidTgt AND [group_id] = @groupId
	END
	
	-- 成功
	SELECT 0 AS err_code;
	RETURN 0;  
END

GO
/****** Object:  StoredProcedure [dbo].[app_group_owner_list_members_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <3/27/2021>
-- Description:	<群主。列出所有本群用户>
--
-- =============================================
CREATE PROCEDURE [dbo].[app_group_owner_list_members_MS]
	@usertToken		 CHAR(40), 
	@groupSecId		CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- MAKE SURE GROUP ID EXISTS
	DECLARE @groupId int = (
		SELECT [dbo].[sec_get_object_id_from_sec_id] ('group', @groupSecId)
	);

	IF @groupId IS NULL
	BEGIN
		SELECT 40008 AS err_code;
		RETURN 40008;  -- 严重安全事故
	END

	-- Group Owner 检验
	DECLARE @uidOwner BIGINT =  (
		SELECT [owner]
		FROM   [dbo].[sys_sec_group]
		WHERE [id] = @groupId);

	-- 用户 1 Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END
	
	-- 用户1 权限检验
	IF (@uidOwner <> @uid) 
	BEGIN
		SELECT 40001 AS err_code;
		RETURN 40001;  -- 严重安全事故
	END

	-- 列出所有群组员
	SELECT usr.[login_name] AS name
		  ,usr.[email]
		  ,gm.[credit]
	FROM [dbo].[sys_sec_group_member] gm
	    JOIN [dbo].[sys_sec_user] usr 
		ON usr.id = gm.user_id
	WHERE gm.group_id = @groupId;
END

GO
/****** Object:  StoredProcedure [dbo].[app_group_owner_list_my_groups_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <3/27/2021>
-- Description:	<群主。列出所有自己为群主的群>
--
-- =============================================
CREATE PROCEDURE [dbo].[app_group_owner_list_my_groups_MS]
	@usertToken		 CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- 用户 1 Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 列出所有我的群
	SELECT [secId] as id
      ,[name]
      ,[max_member_allowed]
      ,[popularity]
      ,[created]
      ,[open_to_new_member]
	FROM [dbo].[sys_sec_group]
	WHERE [owner] = @uid;

END

GO
/****** Object:  StoredProcedure [dbo].[app_group_user_apply_for_member_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <1/20/2021>
-- Description:	<用户·申请加入群>
--
-- =============================================
CREATE PROCEDURE [dbo].[app_group_user_apply_for_member_MS]
	@usertToken	CHAR(40), 
	@groupSecId	CHAR(40)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @rc INT = 0;

	-- Group Id 检验
	DECLARE @groupId int = (
		SELECT [dbo].[sec_get_object_id_from_sec_id] ('group', @groupSecId)
	);

	IF @groupId IS NULL
	BEGIN
		SELECT 40008 AS err_code;
		RETURN 40008;  -- 严重安全事故
	END

	-- 用户 Token 转 Id
	DECLARE @uid BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@usertToken));
	IF @uid IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 群开放吗？
	IF 0 = (SELECT [open_to_new_member]
			FROM   [dbo].[sys_sec_group]
			WHERE  [id] = @groupId)
	BEGIN
		SELECT 40012 AS err_code;
		RETURN 40012;  -- 严重安全事故
	END

	-- 是否已经是群组员
	IF EXISTS (
		SELECT 1
		FROM  [dbo].[sys_sec_group_member]
		WHERE [user_id] = @uid AND [group_id] = @groupId
	)
	BEGIN 
		SELECT 40013 AS err_code;
		RETURN 40013; 
	END

	-- 申请入群, CREDIT 为零， 静候批准
	INSERT INTO [dbo].[sys_sec_group_member]
           ([user_id]
           ,[group_id]
           ,[member_since]
           ,[credit])
     VALUES
           (@uid
           ,@groupId
           ,SYSUTCDATETIME()
           ,0);

	-- 成功
	SELECT 0 AS err_code;
	RETURN 0;  
END

GO
/****** Object:  StoredProcedure [dbo].[sys_handle_exception]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Yang Lian
-- Create date: 7/21/2017
-- Description:	Handle exception
-- =============================================
CREATE PROCEDURE [dbo].[sys_handle_exception]
	@src	VARCHAR(100),
	@msg	VARCHAR(1024)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    DECLARE @errorMessage VARCHAR(4000);
    DECLARE @errorSeverity INT;
    DECLARE @errorState INT;
    DECLARE @errorNumber INT;
    DECLARE @errorProcedure VARCHAR(200);
    DECLARE @customErrorMessage VARCHAR(1024);

	-- Log the exception in NT Events
	SELECT  @errorMessage = ERROR_MESSAGE(),
			@errorSeverity = ERROR_SEVERITY(),
			@errorState = ERROR_STATE(),
			@errorProcedure = ERROR_PROCEDURE(),
			@errorNumber = ERROR_NUMBER();

   IF @errorNumber IS NULL
   BEGIN
		SET @errorNumber = 20101210;
		SET @errorMessage = 'Application error ';
   END			
	SET @customErrorMessage = ' Exception caught on line number ' 
				+ convert(varchar(4),ISNULL(ERROR_LINE(),-1)) 
				+ '.  Error Message: ' 
				+ @ErrorMessage 
				+ 'Error Number:[' + convert(varchar(5),ISNULL(@ErrorNumber,-1)) + ']' 
				+ CHAR(13)
				+ ' Context: ' + @msg;
      
	PRINT @customErrorMessage;

	INSERT INTO [dbo].[sys_admin_err_log]
        ([err_source]
        ,[err_type]
        ,[err_msg]
        ,[time]
        ,[attachment_txt]
        ,[attachment_num])
	VALUES
        (@src
        ,1
        ,@customErrorMessage
        ,SYSUTCDATETIME()
        ,NULL
        ,@errorNumber);

	RETURN @errorNumber;
END




GO
/****** Object:  StoredProcedure [dbo].[sys_sec_admin_approve_user_registration_ADMIN]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- =============================================================
-- Author:		<LIAN YANG>
-- Create date: <2020/12/12/
-- Description:	管理员用户批准用户正式成为系统用户， 
--
-- ==============================================================
create PROCEDURE [dbo].[sys_sec_admin_approve_user_registration_ADMIN] 
	@adminUsertToken	CHAR(40),   -- 管理员用户token
	@email				varchar(64)	-- 需要验证的用户email
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @rc INT = 0;
	
	-- 用户不存在？ 安全事故？
	DECLARE @uid BIGINT = (
		SELECT [id] 
		FROM   [dbo].[sys_sec_user]
		WHERE  [email] = @email
	);
	IF @uid IS NULL
	BEGIN
		SELECT 40004 AS err_code;
		DECLARE	@errSrc VARCHAR(32) = '[security]';
		DECLARE	@errMsg VARCHAR(1024) = 'invalid email ' + @email;
		EXEC @rc = [dbo].[sys_handle_exception] @errSrc, @errMsg;
		RETURN;
	END

	DECLARE @errCode INT = (
		SELECT [dbo].[sec_user_can_do4] (
			@adminUsertToken
			,'accept_new_user'));
	IF @errCode <> 0
	BEGIN
		SELECT @errCode;
		RETURN;
	END

	-- 用户验证成功
	UPDATE [dbo].[sys_sec_pw]
		SET [email_verified_date] = SYSUTCDATETIME()
	WHERE user_id = @uid;

	-- 返回成功
	SELECT 0 AS err_code;

END







GO
/****** Object:  StoredProcedure [dbo].[sys_sec_group_owner_approve_user_membership_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- =============================================================
-- Author:		<LIAN YANG>
-- Create date: <2021/1/20>
-- Description:	群主批准用户入群， 
--
-- ==============================================================
CREATE PROCEDURE [dbo].[sys_sec_group_owner_approve_user_membership_MS] 
	@groupOwnerUsertToken	CHAR(40),   -- 群主 token
	@applicationUsertToken	CHAR(40),	-- 需要入群的用户 token
	@groupName VARCHAR(64)				-- 群名
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @rc INT = 0;
	
	-- 群主用户 Token 转 Id
	DECLARE @uid_owner BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@groupOwnerUsertToken));
	IF @uid_owner IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- 目标用户 Token 转 Id
	DECLARE @uid_appl BIGINT = (SELECT [dbo].[sec_user_is_authenticated2] (@applicationUsertToken));
	IF @uid_appl IS NULL
	BEGIN
		SELECT 50000 AS err_code;
		RETURN 50000;  -- 严重安全事故
	END

	-- Group Name 转 Id
	DECLARE @gid INT = (SELECT [dbo].[sec_get_object_id] ('group', @groupName));
	IF @gid IS NULL
	BEGIN
		SELECT 40011 AS err_code;
		RETURN 40011;  -- 严重安全事故
	END

	-- 目标用户有申请过吗？
	DECLARE @credit INT = (
		SELECT [credit]
		FROM   [dbo].[sys_sec_group_member]
		WHERE  [user_id] = @uid_appl AND
			   [group_id] = @gid
	);
	IF @credit IS NULL 
	BEGIN
		SELECT 40009 AS err_code;
		RETURN 40009;
	END

	-- 已经入群
	IF @credit > 0
	BEGIN
		SELECT 0 AS err_code;
		RETURN 0;
	END

	-- 群主吗？
	IF @uid_owner <> (
						SELECT [owner]
						FROM   [dbo].[sys_sec_group]
						WHERE  [id] = @gid
	)
	BEGIN
		SELECT 40001 AS err_code;
		RETURN 40001;  -- 严重安全事故
	END

	-- 批准用户申请， 赋予1000 credit
	UPDATE [dbo].[sys_sec_group_member]
	   SET [credit] = 1000
	WHERE  [user_id] = @uid_appl AND
		   [group_id] = @gid;

	-- 返回成功
	SELECT 0 AS err_code;

END







GO
/****** Object:  StoredProcedure [dbo].[sys_sec_user_login_name_check_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- ===============================================
-- Author:		<LIAN YANG>
-- Create date: <2021/2/17
-- Description: 搜索用户名， 存在则返回1， 不存在则返回0
--  
--
-- ================================================
create PROCEDURE [dbo].[sys_sec_user_login_name_check_MS] 
	@name			varchar(32)	-- name
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @rc INT = 0;
	
	-- 用户已经存在？
	IF EXISTS (
		SELECT 1 
		FROM   [dbo].[sys_sec_user]
		WHERE  [login_name] = @name
	)
	BEGIN
		SELECT 1 
		RETURN;
	END

	SELECT 0 
	RETURN;
END



GO
/****** Object:  StoredProcedure [dbo].[sys_sec_user_login_with_name_and_pw_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- ===============================================
-- Author:		<LIAN YANG>
-- Create date: <2020/12/20>
-- Description:	基本用户登录SP.
--  
--
-- ================================================
CREATE PROCEDURE [dbo].[sys_sec_user_login_with_name_and_pw_MS] 
	@name			varchar(32),	-- name
	@pwh			char(64)		-- 密码哈西
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- 用户不存在？
	DECLARE @secId CHAR(40), @id BIGINT;
	SELECT @id = [id]
	FROM   [dbo].[sys_sec_user] 
	WHERE  [login_name] = @name;

	IF @id IS NULL
	BEGIN
		SELECT 40010 AS err_code;
		RETURN;
	END

	DECLARE @rc INT = 0;

	-- 用户未经授权
	IF 0 = (SELECT [dbo].[sec_user_is_authenticated] (@id))
	BEGIN
		SELECT 40000 AS err_code;
		RETURN;
	END
	
	-- 返回用户安全Token
	SELECT @secId =[sec_id]
	FROM [dbo].[sys_sec_pw]
	WHERE [user_id] = @id AND
		  [pw_hash] = @pwh;

	-- 密码错误?
	IF @secId IS NULL
	BEGIN
		-- 返回密码错误
		SELECT 40003 AS err_code;	
	END ELSE
	BEGIN
		-- 返回用户token
		SELECT 0 AS err_code, @secId AS security_token;
	END
END







GO
/****** Object:  StoredProcedure [dbo].[sys_sec_user_name_check_Public]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- ===============================================
-- Author:		<LIAN YANG>
-- Create date: <2021/2/17
-- Description: 搜索用户名， 存在则返回1， 不存在则返回0
--  
--
-- ================================================
create PROCEDURE [dbo].[sys_sec_user_name_check_Public] 
	@name			varchar(32)	-- name
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @rc INT = 0;
	
	-- 用户已经存在？
	IF EXISTS (
				SELECT 1 
				FROM   [dbo].[sys_sec_user]
				WHERE  [email] = @name
	)
	BEGIN
		SELECT 1 
		RETURN;
	END
	SELECT 0 
	RETURN;
END







GO
/****** Object:  StoredProcedure [dbo].[sys_sec_user_register_with_name_and_pw_MS]    Script Date: 4/2/2021 10:15:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- ===============================================
-- Author:		<LIAN YANG>
-- Create date: <2018/9/14
-- Description:	基本用户注册SP.
--  
--
-- ================================================
CREATE PROCEDURE [dbo].[sys_sec_user_register_with_name_and_pw_MS] 
	@name			varchar(32),	-- name
	@email			varchar(64),	-- email
	@fistName		nvarchar(32),	-- first name
	@lastName		nvarchar(32),	-- last name
	@pwh			char(64)		-- 密码哈西
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @rc INT = 0;
	
	-- 用户已经存在？
	IF EXISTS (
				SELECT 1 
				FROM   [dbo].[sys_sec_user]
				WHERE  [email] = @email
	)
	BEGIN
		SELECT 40004 AS err_code;
		RETURN;
	END
	IF EXISTS (
				SELECT 1 
				FROM   [dbo].[sys_sec_user]
				WHERE  [login_name] = @name
	)
	BEGIN
		SELECT 40005 AS err_code;
		RETURN;
	END

	-- 执行内部SP
	BEGIN TRY
		BEGIN TRAN
			DECLARE @now DATETIME = SYSUTCDATETIME();
			-- 插入新用户
			INSERT INTO [dbo].[sys_sec_user]
				   ([email]
				   ,[login_name]
				   ,[first_name]
				   ,[last_name]
				   ,[join_date])
			 VALUES
				   (@email
				   ,@name
				   ,@fistName
				   ,@lastName
				   ,@now);
			DECLARE @newUser INT = SCOPE_IDENTITY();

			-- 产生安全ID
			DECLARE @secStr VARCHAR(128) = @pwh + convert(varchar(25), SYSUTCDATETIME(), 121);
			DECLARE @secId CHAR(40) = (SELECT [dbo].[sec_get_hash_simple_sha1] (@secStr));

			-- 密码
			INSERT INTO [dbo].[sys_sec_pw]
			   ([user_id]
			   ,[pw_hash]
			   ,[sec_id]
			   ,[last_update_date]
			   ,[email_verified_date])
			VALUES
			   (@newUser
			   ,@pwh
			   ,@secId
			   ,@now
			   ,NULL);

		-- 转帐记录
			/*
			
			EXECUTE @RC = [dbo].[sys_sec_user_init_trx_history_INTERNAL] 
							 @newUser
							,@pwh
						    ,10;

			-- 用户加入学生互动聊天室
			INSERT INTO [dbo].[app_chatgroup]
				   ([chat_id]
				   ,[user_id]
				   ,[completed])
			VALUES
				   ((SELECT	[value]
					FROM	[dbo].[sys_string_param]
					WHERE	[name] = 'user_group_sys')
				   ,@newUser
				   ,0);
			*/
		-- 返回成功
		SELECT 0 AS err_code;

		-- 事务提交
		COMMIT TRAN;
	END TRY
	BEGIN CATCH
	    -- roll back in if needed
		IF XACT_STATE() <> 0 ROLLBACK;

		-- better error handling
		DECLARE	@errSrc VARCHAR(32) = '[sys_sec_user_register_with_name_and_pw_MS]';
		DECLARE	@errMsg VARCHAR(1024) = 'Failed to register user';
		EXEC @rc = [dbo].[sys_handle_exception] @errSrc, @errMsg;
		SELECT @rc AS err_code;
	END CATCH 

END







GO
USE [master]
GO
ALTER DATABASE [YatuEdu] SET  READ_WRITE 
GO

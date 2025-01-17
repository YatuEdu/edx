USE [master]
GO
/****** Object:  Database [YatuEdu]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  UserDefinedFunction [dbo].[sec_get_hash_simple_sha1]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  UserDefinedFunction [dbo].[sec_user_is_authenticated]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_admin_err_log]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_err_code]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_group]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group](
	[id] [int] NOT NULL,
	[name] [varchar](32) NOT NULL,
	[parent_org] [int] NOT NULL,
	[type] [tinyint] NOT NULL,
	[owner] [bigint] NOT NULL,
	[max_member_allowed] [int] NOT NULL,
	[created] [datetime] NOT NULL,
 CONSTRAINT [PK_sys_sec_communication_group] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group_member]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_group_session]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group_session](
	[id] [int] IDENTITY(10000,1) NOT NULL,
	[group_id] [int] NOT NULL,
	[max_member_allowed] [int] NOT NULL,
	[max_minutes_allowed] [int] NOT NULL,
	[starter] [bigint] NOT NULL,
	[start_time] [datetime] NOT NULL,
	[end_time] [datetime] NULL,
 CONSTRAINT [PK_sys_sec_group_session] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_group_type]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_group_type](
	[id] [tinyint] NOT NULL,
	[description] [varchar](32) NOT NULL,
 CONSTRAINT [PK_sys_sec_group_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_org]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_permission]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_permission_scope]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_permission_scope](
	[scope] [tinyint] NOT NULL,
	[description] [varchar](32) NOT NULL,
 CONSTRAINT [PK_sys_sec_permission_scope] PRIMARY KEY CLUSTERED 
(
	[scope] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_pw]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_pw](
	[user_id] [bigint] NOT NULL,
	[pw_hash] [char](64) NOT NULL,
	[last_update_date] [datetime] NOT NULL,
	[email_verified_date] [datetime] NULL,
 CONSTRAINT [PK_sys_sec_pw] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_role]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_role_for_user]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_role_permissions]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_user]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_user](
	[id] [bigint] IDENTITY(100000,1) NOT NULL,
	[login_name] [nchar](32) NOT NULL,
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
INSERT [dbo].[sys_admin_err_log] ([err_source], [err_type], [err_msg], [time], [attachment_txt], [attachment_num]) VALUES (N'[sys_sec_user_register_with_name', 1, N' Exception caught on line number 49.  Error Message: Cannot insert the value NULL into column ''id'', table ''YatuEdu.dbo.sys_sec_user''; column does not allow nulls. INSERT fails.Error Number:[515] Context: Failed to register user', CAST(N'2020-12-12T21:06:42.2614950' AS DateTime2), NULL, 515)
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40001, N'Unauthorized access', N'用户无操作权限')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40002, N'Unknown email address', N'邮箱用户不存在')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40003, N'Password is wrong', N'密码错误')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40004, N'This email address  is already registered', N'邮箱用户已经注册')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (40005, N'This login name has been used by another user', N'用户名已被经注册')
INSERT [dbo].[sys_err_code] ([type], [description_en], [description_cn]) VALUES (80001, N'Not enough fund', N'余额不足')
INSERT [dbo].[sys_sec_group] ([id], [name], [parent_org], [type], [owner], [max_member_allowed], [created]) VALUES (0, N'yatu', 0, 101, 0, 10, CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (0, N'system group')
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (99, N'video and whiteboard class')
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (100, N'edu class that teaches a subject')
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (101, N'vedio conf ')
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (102, N'chat group')
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (103, N'news group')
INSERT [dbo].[sys_sec_org] ([id], [name], [signature], [parent_id], [public_facing], [summary]) VALUES (0, N'yatu', N'0', 0, 0, N'Yatu System')
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (1, N'assign_role', N'admin assign roles to user', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (2, N'manage_money', N'accountant manages money', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (3, N'create_org', N'admin create organization', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (4, N'manage_global_content', N'sys content manager can censor application wide content', 0)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (101, N'assign_org_role', N'orgadmin can assign roles locally within her org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (102, N'manage_org_money', N'orgadin can manage money locally within her org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (103, N'create_sub_org', N'orgadmin can create sub org within her own org', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (300, N'create_content', N'content creater creates content', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (301, N'manage_content', N'content manager manages (edit, delete, etc) content', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (302, N'approve_content', N'content manager can approve content to be published', 1)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (500, N'manage_grouop', N'group manager can monitor, remove, close, and etc a group', 2)
INSERT [dbo].[sys_sec_permission] ([id], [permission], [description], [scope]) VALUES (501, N'manage-group_content', N'group content manger manges content within a group', 2)
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (0, N'system permission')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (1, N'org permission')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (2, N'group permission')
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (0, N'891a7230996035f676b53e67e87653710d01559934a97407e98f9b3ce19e0056', CAST(N'2020-12-06T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (1, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', CAST(N'2020-12-01T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (2, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', CAST(N'2020-12-01T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (3, N'6829c3a061061ef0ea5169b76695f6ee8590e92443127621797edd03fa6363ae', CAST(N'2020-12-09T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (4, N'6829c3a061061ef0ea5169b76695f6ee8590e92443127621797edd03fa6363ae', CAST(N'2020-12-09T00:00:00.000' AS DateTime), CAST(N'2020-12-01T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date], [email_verified_date]) VALUES (100000, N'4a8d4a2441658d34b54363165a905f4a1be82219d99cdbe0a0ef456924abaae6', CAST(N'2020-12-12T21:07:49.630' AS DateTime), NULL)
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
SET IDENTITY_INSERT [dbo].[sys_sec_user] OFF
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_permission_uk]    Script Date: 12/12/2020 1:58:28 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_permission_uk] ON [dbo].[sys_sec_permission]
(
	[permission] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_email_uk]    Script Date: 12/12/2020 1:58:28 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_email_uk] ON [dbo].[sys_sec_user]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_user_name_uk]    Script Date: 12/12/2020 1:58:28 PM ******/
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
ALTER TABLE [dbo].[sys_sec_group_session] ADD  CONSTRAINT [DF_sys_sec_group_session_max_member_allowed]  DEFAULT ((10)) FOR [max_member_allowed]
GO
ALTER TABLE [dbo].[sys_sec_group_session] ADD  CONSTRAINT [DF_sys_sec_group_session_max_minutes_allowed]  DEFAULT ((30)) FOR [max_minutes_allowed]
GO
ALTER TABLE [dbo].[sys_sec_org] ADD  CONSTRAINT [DF_org_parent_id]  DEFAULT ((0)) FOR [parent_id]
GO
ALTER TABLE [dbo].[sys_sec_org] ADD  CONSTRAINT [DF_org_public_facing]  DEFAULT ((0)) FOR [public_facing]
GO
ALTER TABLE [dbo].[sys_sec_org]  WITH CHECK ADD  CONSTRAINT [FK_org_parent] FOREIGN KEY([parent_id])
REFERENCES [dbo].[sys_sec_org] ([id])
GO
ALTER TABLE [dbo].[sys_sec_org] CHECK CONSTRAINT [FK_org_parent]
GO
ALTER TABLE [dbo].[sys_sec_role_for_user]  WITH CHECK ADD  CONSTRAINT [FK_sys_sec_role_for_user_role] FOREIGN KEY([role_id])
REFERENCES [dbo].[sys_sec_role] ([id])
GO
ALTER TABLE [dbo].[sys_sec_role_for_user] CHECK CONSTRAINT [FK_sys_sec_role_for_user_role]
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
/****** Object:  StoredProcedure [dbo].[app_start_video_conf_now]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Lian Yang>
-- Create date: <12/9/2020>
-- Description:	<Member of a group start a video conf>
-- =============================================
CREATE PROCEDURE [dbo].[app_start_video_conf_now]
	@userId		BIGINT, 
	@groupId	INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- 权限验证

	-- 一人同时只能进入或启动一个视频会议SESSION

	-- 是否已经开始？ 如此， 则加入会议

	-- 创建 session 

	-- 返回session id, 或者 err id (失败号）
	
	-- 通知全组人员有会 （通过soxket）
END

GO
/****** Object:  StoredProcedure [dbo].[sys_handle_exception]    Script Date: 12/12/2020 1:58:28 PM ******/
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
/****** Object:  StoredProcedure [dbo].[sys_sec_user_register_with_name_and_pw_MS]    Script Date: 12/12/2020 1:58:28 PM ******/
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

		-- 密码
		INSERT INTO [dbo].[sys_sec_pw]
           ([user_id]
           ,[pw_hash]
           ,[last_update_date]
           ,[email_verified_date])
		VALUES
           (@newUser
           ,@pwh
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
/****** Object:  StoredProcedure [dbo].[sys_sec_user_verified_email_MS]    Script Date: 12/12/2020 1:58:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Batch submitted through debugger: Token_trade_18_09_07_full_schema_only.sql|11931|0|C:\Users\lianyang3\Documents\Ideas\YunAnYaTu\BitCoin\SRC\DB\Token_trade_18_09_07_full_schema_only.sql
-- =============================================================
-- Author:		<LIAN YANG>
-- Create date: <2020/12/12/
-- Description:	用户验证邮箱成功. 微服服务收到验证成功的email后， 
--              call 这个 SP.
--
-- ==============================================================
create PROCEDURE [dbo].[sys_sec_user_verified_email_MS] 
	@email			varchar(64)	-- email
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
	)
	BEGIN
		SELECT 40004 AS err_code;
		DECLARE	@errSrc VARCHAR(32) = '[security]';
		DECLARE	@errMsg VARCHAR(1024) = 'invalid email ' + @email;
		EXEC @rc = [dbo].[sys_handle_exception] @errSrc, @errMsg;
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
USE [master]
GO
ALTER DATABASE [YatuEdu] SET  READ_WRITE 
GO

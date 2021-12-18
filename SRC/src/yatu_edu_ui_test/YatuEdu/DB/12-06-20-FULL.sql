USE [master]
GO
/****** Object:  Database [YatuEdu]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_communication_group]    Script Date: 12/6/2020 1:28:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_communication_group](
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
/****** Object:  Table [dbo].[sys_sec_group_type]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_org]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_permission]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_permission_scope]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_pw]    Script Date: 12/6/2020 1:28:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_pw](
	[user_id] [bigint] NOT NULL,
	[pw_hash] [char](64) NOT NULL,
	[last_update_date] [datetime] NOT NULL,
 CONSTRAINT [PK_sys_sec_pw] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[sys_sec_role]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_role_for_user]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_role_permissions]    Script Date: 12/6/2020 1:28:00 PM ******/
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
/****** Object:  Table [dbo].[sys_sec_user]    Script Date: 12/6/2020 1:28:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_sec_user](
	[id] [bigint] NOT NULL,
	[login_name] [nchar](32) NOT NULL,
	[email] [varchar](64) NOT NULL,
	[first_name] [nchar](10) NOT NULL,
	[last_name] [nchar](10) NOT NULL,
	[join_date] [datetime] NOT NULL,
 CONSTRAINT [PK_sys_sec_user] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[sys_sec_group_type] ([id], [description]) VALUES (0, N'system group')
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
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (0, N'system permission')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (1, N'org permission')
INSERT [dbo].[sys_sec_permission_scope] ([scope], [description]) VALUES (2, N'group permission')
INSERT [dbo].[sys_sec_pw] ([user_id], [pw_hash], [last_update_date]) VALUES (0, N'891a7230996035f676b53e67e87653710d01559934a97407e98f9b3ce19e0056', CAST(N'2020-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (0, N'public', N'user with no special roles')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (99, N'org_content_man', N'content manager for the application')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (100, N'orgadmin', N'admin who is responsible for an org')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (800, N'sys_content_man', N'system content manager')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (900, N'accountant', N'accontant who can do clearing for users payment')
INSERT [dbo].[sys_sec_role] ([id], [role_name], [description]) VALUES (1000, N'admin', N'system admin who can create user and org and assign roles')
INSERT [dbo].[sys_sec_role_for_user] ([user_id], [role_id], [org_id], [group_id]) VALUES (0, 1000, 0, NULL)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (99, 301)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 101)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 102)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (100, 103)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (800, 4)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (900, 2)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 1)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 2)
INSERT [dbo].[sys_sec_role_permissions] ([role_id], [permission_id]) VALUES (1000, 3)
INSERT [dbo].[sys_sec_user] ([id], [login_name], [email], [first_name], [last_name], [join_date]) VALUES (0, N'ly8838                          ', N'ly8838@gmail.com', N'Lian      ', N'Yang      ', CAST(N'2010-12-01T00:00:00.000' AS DateTime))
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_permission_uk]    Script Date: 12/6/2020 1:28:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_permission_uk] ON [dbo].[sys_sec_permission]
(
	[permission] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_email_uk]    Script Date: 12/6/2020 1:28:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_email_uk] ON [dbo].[sys_sec_user]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_sys_sec_user_name_uk]    Script Date: 12/6/2020 1:28:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_sys_sec_user_name_uk] ON [dbo].[sys_sec_user]
(
	[login_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[sys_sec_communication_group] ADD  CONSTRAINT [DF_sys_sec_communication_group_max_member_allowed]  DEFAULT ((-1)) FOR [max_member_allowed]
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
USE [master]
GO
ALTER DATABASE [YatuEdu] SET  READ_WRITE 
GO

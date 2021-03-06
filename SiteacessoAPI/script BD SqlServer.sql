USE [master]
GO
USE [pdv_web]
GO
/****** Object:  Table [dbo].[cliente]    Script Date: 09/09/2016 14:03:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[cliente](
	[id_cliente] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](100) NULL,
	[cpf] [varchar](14) NULL,
 CONSTRAINT [PK_cliente] PRIMARY KEY CLUSTERED 
(
	[id_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[itens_venda]    Script Date: 09/09/2016 14:03:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[itens_venda](
	[id_itens_venda] [int] IDENTITY(1,1) NOT NULL,
	[id_produto] [int] NULL,
	[id_venda] [int] NULL,
	[sequencia] [int] NULL,
	[qtde] [int] NULL,
	[valor_unitario] [numeric](15, 2) NULL,
	[sub_total] [numeric](15, 2) NULL,
	[status_item] [varchar](20) NULL,
 CONSTRAINT [PK_itens_venda] PRIMARY KEY CLUSTERED 
(
	[id_itens_venda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[produto]    Script Date: 09/09/2016 14:03:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[produto](
	[id_produto] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](40) NULL,
	[descricao] [varchar](60) NULL,
	[preco_compra] [numeric](15, 2) NULL,
	[preco_venda] [numeric](15, 2) NULL,
	[qtde_estoque] [numeric](15, 2) NULL,
	[imagem_produto] [text] NULL,
	[ativo] [char](1) NULL,
	[data_cadastro] [nchar](10) NULL,
 CONSTRAINT [PK_produto] PRIMARY KEY CLUSTERED 
(
	[id_produto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[venda_cabecalho]    Script Date: 09/09/2016 14:03:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[venda_cabecalho](
	[id_venda] [int] IDENTITY(1,1) NOT NULL,
	[id_cliente] [int] NULL,
	[valor_total] [numeric](15, 2) NULL,
	[status_venda] [varchar](20) NULL,
	[data_hora_venda] [datetime] NULL,
 CONSTRAINT [PK_venda_cabecalho] PRIMARY KEY CLUSTERED 
(
	[id_venda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[itens_venda]  WITH CHECK ADD  CONSTRAINT [FK_itens_venda_produto] FOREIGN KEY([id_produto])
REFERENCES [dbo].[produto] ([id_produto])
GO
ALTER TABLE [dbo].[itens_venda] CHECK CONSTRAINT [FK_itens_venda_produto]
GO
ALTER TABLE [dbo].[itens_venda]  WITH CHECK ADD  CONSTRAINT [FK_itens_venda_venda_cabecalho] FOREIGN KEY([id_venda])
REFERENCES [dbo].[venda_cabecalho] ([id_venda])
GO
ALTER TABLE [dbo].[itens_venda] CHECK CONSTRAINT [FK_itens_venda_venda_cabecalho]
GO
ALTER TABLE [dbo].[venda_cabecalho]  WITH CHECK ADD  CONSTRAINT [FK_venda_cabecalho_cliente] FOREIGN KEY([id_cliente])
REFERENCES [dbo].[cliente] ([id_cliente])
GO
ALTER TABLE [dbo].[venda_cabecalho] CHECK CONSTRAINT [FK_venda_cabecalho_cliente]
GO
USE [master]
GO
ALTER DATABASE [pdv_web] SET  READ_WRITE 
GO

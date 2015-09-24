VERSION 5.00
Begin VB.Form frmPhoneBook 
   Caption         =   "PhoneBook 2002"
   ClientHeight    =   6096
   ClientLeft      =   48
   ClientTop       =   336
   ClientWidth     =   5844
   LinkTopic       =   "Form1"
   ScaleHeight     =   6096
   ScaleWidth      =   5844
   StartUpPosition =   3  'Windows Default
   Begin VB.CommandButton cmdQuit 
      Caption         =   "&Quit"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   13.8
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   612
      Left            =   360
      TabIndex        =   7
      Top             =   5040
      Width           =   972
   End
   Begin VB.PictureBox picOutput 
      Height          =   1932
      Left            =   360
      ScaleHeight     =   1884
      ScaleWidth      =   4764
      TabIndex        =   6
      Top             =   2880
      Width           =   4812
   End
   Begin VB.Frame Frame1 
      Caption         =   "Telephone"
      Height          =   1212
      Left            =   360
      TabIndex        =   2
      Top             =   1320
      Width           =   4812
      Begin VB.CheckBox chkCell 
         Caption         =   "&Cell"
         Height          =   372
         Left            =   3120
         TabIndex        =   5
         Top             =   480
         Width           =   972
      End
      Begin VB.CheckBox chkWork 
         Caption         =   "&Work"
         Height          =   372
         Left            =   1800
         TabIndex        =   4
         Top             =   480
         Width           =   972
      End
      Begin VB.CheckBox chkHome 
         Caption         =   "&Home"
         Height          =   372
         Left            =   360
         TabIndex        =   3
         Top             =   480
         Width           =   852
      End
   End
   Begin VB.TextBox txtName 
      Height          =   492
      Left            =   2880
      TabIndex        =   0
      Top             =   360
      Width           =   1452
   End
   Begin VB.Label lblName 
      Alignment       =   2  'Center
      Caption         =   "Enter name to find here:"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   13.8
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   732
      Left            =   240
      TabIndex        =   1
      Top             =   240
      Width           =   2172
   End
End
Attribute VB_Name = "frmPhoneBook"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim strName As String
Dim strPhone As String

Private Sub chkHome_Click()
    
    picOutput.Cls
    If chkHome = 1 Then
        Open "C:\PhoneBook\Home.txt" For Input As #1
        Do While txtName.Text <> "" And Not EOF(1)
            Input #1, strName, strPhone
            If strName = txtName.Text Then
                picOutput.Print strName, strPhone
            End If
        Loop
    End If
        MsgBox "Name not found", vbInformation, "PhoneBook 2002"
        MsgBox "Would you like to add to PhoneBook?", vbYesNo, "PhoneBook 2002"
        Close #1
        strName = txtName.Text
            If 1 Then
                strPhone = InputBox("Enter Home phone number.", "PhoneBook 2002")
                Open "C:\PhoneBook\Home.txt" For Append As #1
                Write #1, strName, strPhone
            End If
        Close #1
    
End Sub

Private Sub cmdQuit_Click()
    
    Unload frmPhoneBook
    End
    
End Sub

Private Sub txtname_GotFocus()
    
    txtName.Text = ""
    chkHome = 0
    
End Sub


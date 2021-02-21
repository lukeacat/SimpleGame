using Newtonsoft.Json;
using SimpleTcp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace frontend
{
    public partial class Form1 : Form
    {
        static SimpleTcpClient client = new SimpleTcpClient("127.0.0.1:8080");
        static Form1 theForm = null;
        public Form1()
        {
            InitializeComponent();
            theForm = this;
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            if (client.IsConnected) {
                client.Disconnect();
                theForm.label5.Text = "down";
                theForm.label5.ForeColor = System.Drawing.Color.Red;
                return;
            }

            theForm.messages.Items.Add(" deez nuts has joined.");
            // set events
            client.Events.Connected += Connected;
            client.Events.Disconnected += Disconnected;
            client.Events.DataReceived += DataReceived;

            try {
                client.Connect();
            } catch (System.Net.Sockets.SocketException) {
                _ = MessageBox.Show("Server is down / or you don't have internet", "This isn't epic", MessageBoxButtons.OK, MessageBoxIcon.Error);
                theForm.label5.Text = "down";
                theForm.label5.ForeColor = System.Drawing.Color.Red;
            }
        }

        
        static void Connected(object sender, EventArgs e) {
            client.SendAsync("{\"op\":\"connect\",\"username\":\"" + theForm.username.Text + "\"}");
  
            theForm.label5.Text = "up";
            theForm.label5.ForeColor = System.Drawing.Color.Green;
        }

        static void Disconnected(object sender, EventArgs e)
        {
            theForm.label5.Text = "down";
            theForm.label5.ForeColor = System.Drawing.Color.Red;
        }

        static void DataReceived(object sender, DataReceivedEventArgs e)
        {
            theForm.messages.Items.Add("recived some kind of event xd iodk");
            Message m = JsonConvert.DeserializeObject<Message>(Encoding.UTF8.GetString(e.Data));
            if (m.op.Equals("connect")) {
                theForm.messages.Items.Add(m.username + " has joined.");
            };

            if (m.op.Equals("message")) {
                theForm.messages.Items.Add(m.username + ": " + m.message);
            };
        }
    }

    class Message
    {
        public string op;
        public string username;
        public string message;
    }
}

interface CommandResult {
  output: string
  type: "output" | "error" | "warning" | "info" | "success" | "system"
  exitCode: number
  metadata?: Record<string, any>
}

export function simulateNetworkCommand(command: string, args: string[], activeConnections: any[]): CommandResult {
  // Simulate network commands
  switch (command) {
    case "ssh":
      return simulateSshCommand(args)

    case "nc":
    case "netcat":
      return simulateNetcatCommand(args)

    case "telnet":
      return simulateTelnetCommand(args)

    case "curl":
      return simulateCurlCommand(args)

    case "wget":
      return simulateWgetCommand(args)

    case "ping":
      return simulatePingCommand(args)

    default:
      return {
        output: `Command not implemented: ${command}`,
        type: "error",
        exitCode: 1,
      }
  }
}

function simulateSshCommand(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      output:
        "usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]\n" +
        "           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]\n" +
        "           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]\n" +
        "           [-i identity_file] [-J [user@]host[:port]] [-L address]\n" +
        "           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]\n" +
        "           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]\n" +
        "           [-w local_tun[:remote_tun]] destination [command]",
      type: "error",
      exitCode: 1,
    }
  }

  // Parse target from args
  let target = args[0]

  // Check for port flag
  const portIndex = args.indexOf("-p")
  let port = "22"

  if (portIndex !== -1 && args.length > portIndex + 1) {
    port = args[portIndex + 1]
    // Remove port from target if it's the same argument
    if (target === args[portIndex] || target === args[portIndex + 1]) {
      target = args.find((arg) => arg !== args[portIndex] && arg !== args[portIndex + 1] && !arg.startsWith("-")) || ""
    }
  }

  // Check if target contains user@host format
  let user = "operator"
  let host = target

  if (target.includes("@")) {
    const parts = target.split("@")
    user = parts[0]
    host = parts[1]
  }

  // Check for identity file
  const identityIndex = args.indexOf("-i")
  let identityFile = ""

  if (identityIndex !== -1 && args.length > identityIndex + 1) {
    identityFile = args[identityIndex + 1]
  }

  return {
    output: `
SSH connection established to ${host} on port ${port} as ${user}
${identityFile ? `Using identity file: ${identityFile}` : "Using password authentication"}

Welcome to ${host}!
Last login: ${new Date().toLocaleString()} from 192.168.1.100

Connection closed.
`,
    type: "output",
    exitCode: 0,
    metadata: {
      connection: {
        type: "ssh",
        host,
        port,
        user,
        identityFile,
      },
    },
  }
}

function simulateNetcatCommand(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      output:
        "usage: nc [-46CDdFhklNnrStUuvZz] [-I length] [-i interval] [-M ttl]\n" +
        "          [-m minttl] [-O length] [-P proxy_username] [-p source_port]\n" +
        "          [-q seconds] [-s source] [-T keyword] [-V rtable] [-W recvlimit] [-w timeout]\n" +
        "          [-X proxy_protocol] [-x proxy_address[:port]] [destination] [port]",
      type: "error",
      exitCode: 1,
    }
  }

  // Check for listen mode
  const isListening = args.includes("-l") || args.includes("-L")

  // Parse host and port
  let host = ""
  let port = ""

  // Find the first non-flag argument for host
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("-") && !port) {
      if (!host) {
        host = args[i]
      } else {
        port = args[i]
        break
      }
    }

    // Skip the argument after a flag that takes a value
    if (["-p", "-w", "-s"].includes(args[i])) {
      i++
    }
  }

  if (isListening) {
    return {
      output: `Listening on ${port ? port : "0.0.0.0:4444"}...
Connection received from 192.168.1.200:54321
Hello from remote host!
Connection closed.
`,
      type: "output",
      exitCode: 0,
    }
  } else {
    if (!host || !port) {
      return {
        output: "nc: missing hostname and port",
        type: "error",
        exitCode: 1,
      }
    }

    return {
      output: `Connected to ${host}:${port}
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: ${new Date().toUTCString()}
Content-Type: text/html
Content-Length: 615
Connection: close

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
</body>
</html>

Connection closed.
`,
      type: "output",
      exitCode: 0,
    }
  }
}

function simulateTelnetCommand(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      output: 'usage: telnet [-468ELadr] [-S tos] [-b address] [-e escapechar] [-l user]\n' +
              '               [-n tracefile] [-o option] [-p port] [-s src_addr] [-x proxy:port]\n' +
              '               [-z] host [port]',
      type: 'error',
      exitCode: 1,\

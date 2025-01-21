import socket
import time
import json

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(("", 9000))
server_socket.listen(5)

print ("TCPServer Waiting for client on port 9000")

while 1:
	client_socket, address = server_socket.accept()
	print ("I got a connection from ", address)
	while 1:
		try:
			data = client_socket.recv(512).decode("utf-8")
			if(data is None or data == ""):
				time.sleep(1)
				continue;

			if(data == 'q' or data == 'Q'):
				client_socket.close()
				break;
			else:
				print ("RECEIVED:" , data)

				json_object = json.loads(data)

				if(json_object["CMD"] == 'WAIT'):
					 # 대기자 목록 response
					resp = '[{\"SYSTEM\":1, \"CMD\": \"WAIT2\", \"WAIT\": "1|2|3|4|5|6|7|8|9|10"}]'
					client_socket.send(resp.encode())
				elif(json_object["CMD"] == 'ISSUE'):
  					# 번호표발급 요청 response
					resp = '[{\"SYSTEM\":1,\"CMD\":\"ISSUE2\", \"K_IP\":\"10.10.210.65\", \"MENU\":5, \"PATIENT\":96476189, \"TICKET\":123, \"WAITCNT\":5}]'
					client_socket.send(resp.encode())

					# 번호표 호출 - 응답이 아닌 발권서버에서 별도 보내는 메시지
					time.sleep(3)
					resp = '[{\"SYSTEM\":1,\"CMD\":\"CALL2\", \"K_IP\":\"10.10.210.65\", \"MENU\":5, \"PATIENT\":96476189, \"CALL_NO\":123,\"DESK\":22}]'
					client_socket.send(resp.encode())

				elif(json_object["DEPT"] != ''):
					# 도착확인 요청 response - DEPT메시지
					resp = '[{\"SYSTEM\":3,\"PATIENT\":96476189, \"DEPT\":\"US\", \"STATUS\":9}]'
					client_socket.send(resp.encode())

					# 도착확인 호출(상태변경)
					time.sleep(3)
					resp = '[{\"SYSTEM\":3,\"PATIENT\":96476189, \"DEPT\":\"US\", \"STATUS\":2}]'
					client_socket.send(resp.encode())

		except:
				print ("CLIENT SOCKET DISCONNECTED : ", address)
				client_socket.close()
				break;
# 	break;
server_socket.close()
print("SOCKET closed... END")

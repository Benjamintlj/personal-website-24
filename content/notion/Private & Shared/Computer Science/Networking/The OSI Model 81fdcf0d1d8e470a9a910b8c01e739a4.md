# The OSI Model

The goal in defining the `ISO/OSI` standard was to create a reference model that enables the communication of different technical systems via various devices and technologies and provides compatibility. The `OSI` model uses `seven` different layers, which are hierarchically based on each other to achieve this goal. These layers represent phases in the establishment of each connection through which the sent packets pass. In this way, the standard was created to 
trace how a connection is structured and established visually.

| **Layer** | **Function** |
| --- | --- |
| `7.Application`
ALL | Among other things, this layer controls the input and output of data and provides the application functions. |
| `6.Presentation`
PEOPLE | The presentation layer's task is to transfer the system-dependent 
presentation of data into a form independent of the application. |
| `5.Session`
SEEM | The session layer controls the logical connection between two systems and prevents, for example, connection breakdowns or other 
problems. |
| `4.Transport`
TO | The Transport Layer performs these tasks to ensure the secure, reliable, and efficient transfer of data between hosts. By detecting and avoiding congestion, it prevents network traffic jams that can slow down or disrupt communication. Additionally, by segmenting data streams into smaller packets, it allows for more efficient use of network resources and improves reliability by allowing retransmission of lost or corrupted packets. |
| `3.Network`
NEED | On the networking layer, connections are established in circuit-switched networks, and data packets are forwarded in packet-switched networks. Data is transmitted over the entire network from the sender to the receiver. |
| `2.Data Link`
DATA | The central task of layer 2 is to enable reliable and error-free transmissions on the respective medium. For this purpose, the bitstreams from layer 1 are divided into blocks or frames. |
| `1.Physical`
PROSESSING | The transmission techniques used are, for example, electrical signals, optical signals, or electromagnetic waves. Through layer 1, the transmission takes place on wired or wireless transmission lines. |

---

The layers `2-4` are `transport oriented`, and the layers `5-7` are `application oriented` layers. In each layer, precisely defined tasks are performed, and the interfaces to the neighboring layers are precisely described. Each layer offers services for use to the layer directly above it. To make these services available, the layer uses the services of the layer below it and performs the tasks of its layer.

If two systems communicate, all seven layers of the `OSI` model are run through at least `twice`, since both the sender and the receiver must take the layer model into account. Therefore, a large number of different tasks must be performed in the individual layers to ensure the communication's security, reliability, and performance.

When an application sends a packet to the other system, the system works the layers shown above from layer `7` down to layer `1`, and the receiving system unpacks the received packet from layer `1` up to layer `7`.
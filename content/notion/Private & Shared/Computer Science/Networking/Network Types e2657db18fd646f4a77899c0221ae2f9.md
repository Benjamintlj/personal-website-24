# Network Types

## What is RFC before we get started?

RFC stands for "Request for Comments." It is a document that describes a proposed standard for how computer systems should communicate with each other. The RFC system was originally used by the US government to develop the early internet protocols.

An example of an RFC is RFC 1918, which defines IP address ranges that are reserved for private networks. These IP addresses are not routable on the public internet, so they are commonly used for internal networks in homes and businesses.

## Lets get started!

Each network has its own unique structure that can be set up on an individual basis. That's why we have these things called `types` and `topologies` to help categorize them. With so many different types of networks out there, it can be overwhelming to read about all of them, especially since some include the geographical range. But don't worry, we'll break it down into `Common Terms` and `Book Terms` to make it easier to understand.

### Common Terminology

| **Network Type** | **Definition** |
| --- | --- |
| Wide Area Network (WAN) | Internet |
| Local Area Network (LAN) | Internal Networks (Ex: Home or Office) |
| Wireless Local Area Network (WLAN) | Internal Networks accessible over Wi-Fi |
| Virtual Private Network (VPN) | Connects multiple network sites to one `LAN` |

---

## WAN

The WAN, or Wide Area Network, is often known as "`The Internet`." Networking equipment usually has a WAN Address and LAN Address. The WAN Address is generally accessed by the Internet, although a WAN is actually just a large number of LANs combined. Large companies or government agencies may have an "Internal WAN," which is also known as Intranet, Airgap Network, etc. To identify if a network is a WAN, we typically use a WAN-specific routing protocol like BGP and check if the IP Schema in use is not within RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).

---

## LAN / WLAN

LANs (Local Area Networks) and WLANs (Wireless Local Area Networks) usually assign IP Addresses specifically intended for local use (RFC 1918, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). In some situations, such as certain colleges or hotels, you may receive a routable (internet) IP Address when you connect to their LAN, but that is much less common. There is no difference between a LAN or WLAN, other than WLANs enable data transmission without cables. It is mainly a security measure.

---

## VPN

There are three main types `Virtual Private Networks` (`VPN`), but all three have the same goal of making the user feel as if they were plugged into a different network.

Site to Site (connecting networks) - Where the routers and firewall share network ranges, so that a network will see other devices (on a physically different network) as if they are on the same network.

Remote Access (connecting a single person to a network) - Allows a single user to connect to a network as if they are on the same local network.

SSL - streams applications or data to you desktop as if they do need be installed on.

---

## Book Terms

| Network Type | Definition |
| --- | --- |
| Global Area Network (GAN) | Global network (the Internet) |
| Metropolitan Area Network (MAN) | Regional network (multiple LANs) |
| Wireless Personal Area Network (WPAN) | Personal network (Bluetooth) |

### GAN

A worldwide network such as the `Internet` is known as a `Global Area Network` (`GAN`). However, the Internet is not the only computer network of this kind. Internationally active companies also maintain isolated networks that span several `WAN`s and connect company computers worldwide. `GAN`s use the glass fibers infrastructure of wide-area networks and 
interconnect them by international undersea cables or satellite transmission.

### MAN

`Metropolitan Area Network` (`MAN`) is a broadband telecommunications network that connects several `LAN`s in geographical proximity. As a rule, these are individual branches of a company connected to a `MAN` via leased lines. High-performance routers and high-performance connections based on glass fibers are used, which enable a significantly higher data throughput than the Internet. The transmission speed between two remote nodes is comparable to communication within a `LAN`.

Internationally operating network operators provide the infrastructure for `MAN`s. Cities wired as `Metropolitan Area Networks` can be integrated supra-regionally in `Wide Area Networks` `WAN`) and internationally in `Global Area Networks` (`GAN`).

### PAN / WPAN

Modern end devices such as smartphones, tablets, laptops, or desktop computers can be connected ad hoc to form a network to enable data exchange. This can be done by cable in the form of a `Personal Area Network` (`PAN`).

The wireless variant `Wireless Personal Area Network` (`WPAN`) is based on Bluetooth or wireless USB technologies. A `wireless personal area network` that is established via bluetooth is called `Piconet`. `PAN`s and `WPAN`s usually extend only a few meters and are therefore not suitable for connecting devices in separate rooms or even buildings.

In the context of the `Internet of Things` (`IoT`), `WPAN`s are used to communicate control and monitor applications with low data rates. Protocols such as Insteon, Z-Wave, and ZigBee were explicitly designed for smart homes and home automation.
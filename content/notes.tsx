import type { ReactNode } from "react";

export type Card = {
  title: string;
  body: ReactNode;
};

export type Category = {
  id: string;
  title: string;
  cards: Card[];
};

export const categories: Category[] = [
  {
    id: "networking",
    title: "Networking & VPC",
    cards: [
      {
        title: "CIDR / Subnetting พื้นฐาน",
        body: (
          <>
            <p>จำนวน IP ในบล็อก = 2<sup>(32 - prefix)</sup> เช่น /24 = 2<sup>8</sup> = 256 ตัว</p>
            <ul>
              <li>Octet = กลุ่ม 8 บิต (4 octet รวมเป็น 32 บิต ของ IPv4)</li>
              <li>Subnet mask บอกว่า octet ไหน &quot;fix&quot; (เครือข่าย) และ octet ไหน &quot;แก้ไขได้&quot; (host)</li>
              <li>AWS VPC/Subnet อนุญาตขนาดตั้งแต่ <code>/16</code> ถึง <code>/28</code> เท่านั้น</li>
              <li>AWS reserve IP แรกเสมอ <strong>5 ตัว</strong> ต่อ subnet (network address, VPC router, DNS, future use, broadcast)</li>
            </ul>
            <p><span className="trap">กับดัก:</span> /1 ไม่ valid เลย (นอก range), /16 valid แต่กินพื้นที่ VPC ทั้งหมดจนไม่เหลือให้ subnet อื่น</p>
          </>
        ),
      },
      {
        title: "NAT Gateway vs Network ACL (NACL)",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>NAT Gateway</th><th>Network ACL</th></tr>
                <tr><td>ให้ instance ใน <strong>private subnet</strong> ออกเน็ตได้ (outbound) โดยไม่เปิดให้ถูกเข้าจากนอก</td><td><strong>Firewall ระดับ subnet</strong> — allow/deny traffic ด้วย rule เป็น stateless (ต้องเปิดทั้ง inbound/outbound เอง)</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: สองตัวนี้คนละหน้าที่กันเลย — NAT คือ &quot;ทางออกเน็ต&quot; ส่วน NACL คือ &quot;กฎกรองทราฟฟิก&quot; อย่าสับสนว่าใช้แทนกันได้</p>
          </>
        ),
      },
      {
        title: "Elastic IP — คงอยู่ถาวรจนกว่าจะปล่อย",
        body: (
          <>
            <p>Elastic IP ไม่หายไปเมื่อ stop/terminate instance เอง — ต้อง <strong>release</strong> เองเท่านั้นถึงจะคืน IP กลับ AWS pool</p>
            <p className="trap">กับดัก: ถ้าปล่อย Elastic IP ไว้โดยไม่ attach กับ instance ที่ running อยู่ จะถูกคิดค่าใช้จ่าย (idle charge)</p>
          </>
        ),
      },
      {
        title: "VPC DNS Attributes",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Attribute</th><th>หน้าที่</th><th>Default</th></tr>
                <tr><td><code>enableDnsSupport</code></td><td>เปิด DNS resolution ใน VPC</td><td>true เสมอ</td></tr>
                <tr><td><code>enableDnsHostnames</code></td><td>ให้ instance มี DNS hostname</td><td>Default VPC/Console = true, CLI/API/CFN = false</td></tr>
              </tbody>
            </table>
            <p>Public DNS hostname ใช้งานได้ต้องมี <strong>ทั้ง</strong> attribute เปิด <strong>และ</strong> instance มี Public IP</p>
          </>
        ),
      },
      {
        title: "Internet Gateway (IGW) และ Public / Private Subnet",
        body: (
          <>
            <ul>
              <li><strong>Internet Gateway</strong> คือประตูให้ VPC คุยกับอินเทอร์เน็ตได้สองทาง — scale และทนทานในตัว (HA, ไม่มีข้อจำกัด bandwidth) <strong>ใช้ฟรี</strong> ผูกกับ VPC ได้ครั้งละ 1 ตัว</li>
              <li>IGW แปลง private IP ↔ public IP (1:1 NAT) ให้ instance ที่มี <strong>Public IPv4 / Elastic IP</strong></li>
              <li><strong>Public subnet</strong> = subnet ที่ route table มีเส้นทาง <code>0.0.0.0/0 → IGW</code> | <strong>Private subnet</strong> = ไม่มีเส้นทางไป IGW</li>
              <li>Instance จะออก/รับอินเทอร์เน็ตตรงๆ ได้ต้องครบ: <strong>(1) IGW ผูกกับ VPC (2) route ไป IGW (3) มี Public/Elastic IP (4) Security Group และ NACL อนุญาต</strong></li>
              <li><strong>IPv6</strong>: ใช้ IGW เช่นกัน แต่ถ้าต้องการ &quot;ออกได้อย่างเดียว ห้ามถูกเข้า&quot; ใช้ <strong>Egress-only Internet Gateway</strong> (เหมือน NAT ของ IPv6)</li>
            </ul>
            <p className="trap">กับดัก: มี IGW แล้วไม่ได้แปลว่า subnet เป็น public — ต้องมี route ไป IGW และ instance ต้องมี public IP ด้วย</p>
          </>
        ),
      },
      {
        title: "Route Table — Destination / Target และตัวอย่าง Public vs Private",
        body: (
          <>
            <p>แต่ละแถวอ่านว่า <strong>&quot;ถ้าแพ็กเก็ตจะไปที่ Destination นี้ ให้ส่งผ่าน Target นี้&quot;</strong> — เลือกแถวที่ตรงแบบ <strong>เจาะจงที่สุด (longest prefix match)</strong>; ถ้าไม่ตรงแถวไหนเลย แพ็กเก็ตถูกทิ้ง</p>
            <ul>
              <li><strong>Destination</strong> = ช่วง IP ปลายทาง (CIDR) เช่น <code>10.0.0.0/16</code>, <code>0.0.0.0/0</code> (ทุกที่ที่เหลือ = default route), prefix list ของ S3</li>
              <li><strong>Target</strong> = ทางออกที่รับแพ็กเก็ตไปส่งต่อ: <code>local</code>, <code>igw-</code>, <code>nat-</code>, <code>vgw-</code> (VPN/DX), <code>pcx-</code> (peering), <code>tgw-</code>, <code>vpce-</code> (Gateway endpoint), <code>eigw-</code></li>
              <li>Route table <strong>ผูกกับ subnet</strong> (ไม่ใช่กับ EC2 แต่ละตัว) — ทุก instance ใน subnet เดียวกันใช้ชุดเดียวกัน; route <code>local</code> มีให้อัตโนมัติและลบไม่ได้</li>
            </ul>
            <p><strong>ตัวอย่าง VPC 10.0.0.0/16</strong></p>
            <table>
              <tbody>
                <tr><th>Subnet</th><th>Destination</th><th>Target</th><th>ความหมาย</th></tr>
                <tr><td rowSpan={2}><strong>Public</strong> (10.0.1.0/24) — วาง NAT GW / web server</td><td>10.0.0.0/16</td><td>local</td><td>คุยกันภายใน VPC</td></tr>
                <tr><td>0.0.0.0/0</td><td>igw-xxxx</td><td>ที่เหลือทั้งหมด → Internet Gateway</td></tr>
                <tr><td rowSpan={2}><strong>Private</strong> (10.0.2.0/24) — app / DB</td><td>10.0.0.0/16</td><td>local</td><td>คุยกันภายใน VPC (ไม่ผ่าน NAT)</td></tr>
                <tr><td>0.0.0.0/0</td><td>nat-xxxx</td><td>ที่เหลือทั้งหมด → NAT Gateway (ออกได้ ข้างนอกเข้าไม่ได้)</td></tr>
                <tr><td><strong>Private ล้วน</strong></td><td>10.0.0.0/16</td><td>local</td><td>มีแค่นี้ → ออกอินเทอร์เน็ตไม่ได้</td></tr>
              </tbody>
            </table>
            <p><strong>เส้นทางออกอินเทอร์เน็ตจาก private subnet:</strong> EC2 → (route private: <code>0.0.0.0/0 → nat</code>) → NAT GW ที่อยู่ใน public subnet → (route public: <code>0.0.0.0/0 → igw</code>) → IGW → Internet</p>
            <table>
              <tbody>
                <tr><th>Target ของ 0.0.0.0/0</th><th>subnet เป็น</th></tr>
                <tr><td>igw-xxxx</td><td>Public (ออก/รับได้ ถ้ามี public IP)</td></tr>
                <tr><td>nat-xxxx</td><td>Private ที่ออกอินเทอร์เน็ตได้</td></tr>
                <tr><td>ไม่มี route นี้</td><td>Private ล้วน</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: Public/Private ตัดสินจาก route table ไม่ใช่ชื่อ — มี <code>0.0.0.0/0 → igw</code> = public | NAT GW ต้องอยู่ใน subnet ที่มี route ไป IGW (+ Elastic IP) ถึงจะออกอินเทอร์เน็ตได้</div>
            <p className="trap">กับดัก: ปลายทางใน VPC ใช้ <code>local</code> ไม่ใช่ <code>nat</code> (อย่าเขียน 10.0.0.0/16 → nat) | route ไป IGW อย่างเดียวไม่พอ ต้องมี public IP ด้วย | Private NAT Gateway (ไม่มี EIP) ออกอินเทอร์เน็ตไม่ได้ ใช้ติดต่อเครือข่ายส่วนตัวอื่น</p>
          </>
        ),
      },
      {
        title: "NAT Gateway vs NAT Instance",
        body: (
          <>
            <p>ใช้ให้ instance ใน <strong>private subnet</strong> &quot;ออกอินเทอร์เน็ตได้&quot; (เช่น อัปเดตแพ็กเกจ เรียก API ภายนอก) โดย<strong>อินเทอร์เน็ตเริ่มเชื่อมต่อเข้ามาไม่ได้</strong> (outbound only)</p>
            <table>
              <tbody>
                <tr><th></th><th>NAT Gateway</th><th>NAT Instance</th></tr>
                <tr><td>การจัดการ</td><td>AWS จัดการให้ (managed) แนะนำใช้เป็นหลัก</td><td>EC2 ที่ตั้งค่าเอง (legacy) ต้องดูแล patch/scale/failover เอง</td></tr>
                <tr><td>Availability</td><td>HA ภายใน AZ — ถ้าต้องการทนต่อ AZ ล่ม ต้องสร้าง <strong>1 ตัวต่อ AZ</strong></td><td>ต้องทำ failover เอง (เช่น script / ASG)</td></tr>
                <tr><td>Bandwidth</td><td>scale อัตโนมัติสูงมาก</td><td>จำกัดตามขนาด instance</td></tr>
                <tr><td>Security Group</td><td>ผูกไม่ได้ (คุมด้วย NACL ของ subnet)</td><td>ผูก Security Group ได้</td></tr>
                <tr><td>อื่นๆ</td><td>คิดค่าบริการรายชั่วโมง + ตามปริมาณข้อมูล</td><td>ต้อง<strong>ปิด Source/Destination check</strong>, ใช้เป็น bastion/port forwarding ได้</td></tr>
              </tbody>
            </table>
            <ul>
              <li><strong>NAT Gateway ต้องอยู่ใน public subnet</strong> และมี Elastic IP — แล้วให้ route table ของ private subnet ชี้ <code>0.0.0.0/0 → NAT Gateway</code></li>
              <li>มี <strong>Private NAT Gateway</strong> (ไม่มี Elastic IP) ไว้ต่อกับ VPC อื่น/on-prem ไม่ใช่เพื่อออกอินเทอร์เน็ต</li>
            </ul>
            <div className="tip">หลักจำ: private subnet ออกเน็ตได้แต่ห้ามถูกเข้า → NAT Gateway (วางใน public subnet) | ทนต่อ AZ ล่ม → NAT Gateway ต่อ AZ | NAT Instance ต้องปิด Source/Destination check</div>
          </>
        ),
      },
      {
        title: "Security Group vs Network ACL",
        body: (
          <>
            <table>
              <tbody>
                <tr><th></th><th>Security Group</th><th>Network ACL (NACL)</th></tr>
                <tr><td>ระดับ</td><td>ระดับ <strong>instance (ENI)</strong></td><td>ระดับ <strong>subnet</strong></td></tr>
                <tr><td>State</td><td><strong>Stateful</strong> — อนุญาตขาเข้าแล้ว ขาตอบกลับผ่านอัตโนมัติ</td><td><strong>Stateless</strong> — ต้องเปิดทั้งขาเข้า/ขาออกเอง (รวม ephemeral ports 1024-65535)</td></tr>
                <tr><td>ชนิด rule</td><td><strong>Allow เท่านั้น</strong> (ไม่มี deny)</td><td>มีทั้ง <strong>Allow และ Deny</strong></td></tr>
                <tr><td>การประเมิน</td><td>ดูทุก rule รวมกัน</td><td>ดูตามเลข rule จากน้อยไปมาก เจอที่ตรงก่อนใช้อันนั้น</td></tr>
                <tr><td>ค่าเริ่มต้น</td><td>ขาเข้า <strong>ปฏิเสธทั้งหมด</strong> / ขาออก <strong>อนุญาตทั้งหมด</strong></td><td>Default NACL อนุญาตทั้งหมด; NACL ที่สร้างใหม่ ปฏิเสธทั้งหมดจนกว่าจะเพิ่ม rule</td></tr>
                <tr><td>จุดเด่น</td><td>อ้างอิง Security Group อื่นเป็น source ได้ (เช่น web-sg → db-sg)</td><td><strong>บล็อก IP เฉพาะ</strong> ได้</td></tr>
              </tbody>
            </table>
            <ul>
              <li>1 instance มีได้หลาย Security Group และ rule มีผลทันที</li>
              <li>Traffic เข้า-ออก subnet ต้องผ่านทั้ง NACL (ด่าน subnet) และ Security Group (ด่าน instance)</li>
            </ul>
            <p className="trap">กับดัก: ต้องการ &quot;บล็อก IP ที่โจมตี&quot; → ใช้ NACL deny (Security Group สั่ง deny ไม่ได้) | ต้องการ &quot;อนุญาตเฉพาะพอร์ตที่แอปใช้&quot; → Security Group</p>
          </>
        ),
      },
      {
        title: "ลำดับการประเมิน Rule — Security Group vs NACL",
        body: (
          <>
            <h4>Security Group: ไม่มี &quot;ลำดับ&quot; และไม่มี Deny</h4>
            <ul>
              <li>Security Group มีแต่ rule <strong>Allow</strong> — สร้าง deny rule ไม่ได้ ดังนั้นไม่มีสถานการณ์ &quot;deny ชนกับ allow&quot;</li>
              <li>AWS <strong>ประเมินทุก rule พร้อมกัน</strong> (ไม่มีเลขลำดับ) ถ้า <strong>มี rule ใดก็ได้ที่ตรง</strong> → ผ่าน; ถ้าไม่มี rule ไหนตรงเลย → ถูกปฏิเสธ (implicit deny)</li>
              <li>ถ้า instance มีหลาย Security Group → rule ของทุกกลุ่มถูก <strong>รวมกัน (union)</strong> เป็นชุดเดียว</li>
              <li>อยากให้ &quot;ปิด&quot; พอร์ตไหน = <strong>ไม่ต้องเปิด</strong> หรือลบ allow rule นั้นออก</li>
            </ul>
            <h4>NACL: เรียงตามเลข rule จากน้อยไปมาก — เจอที่ตรงก่อนแล้วหยุด</h4>
            <table>
              <tbody>
                <tr><th>Rule #</th><th>Type</th><th>Source</th><th>Action</th></tr>
                <tr><td>100</td><td>HTTP (80)</td><td>0.0.0.0/0</td><td>ALLOW</td></tr>
                <tr><td>110</td><td>All traffic</td><td>203.0.113.5/32</td><td>DENY</td></tr>
                <tr><td>*</td><td>All traffic</td><td>0.0.0.0/0</td><td>DENY (rule สุดท้าย แก้/ลบไม่ได้)</td></tr>
              </tbody>
            </table>
            <ul>
              <li>แพ็กเก็ตจาก <code>203.0.113.5</code> ไปพอร์ต 80 → ตรง <strong>rule 100 (Allow) ก่อน</strong> → <strong>ผ่าน</strong> และไม่ดู rule 110 อีกเลย (deny ไม่ทำงาน!)</li>
              <li>แก้: ให้ <strong>Deny มีเลขน้อยกว่า Allow</strong> เช่น Deny เป็น 90 → ถูกเช็กก่อนและบล็อก</li>
              <li>ไม่มี rule ไหนตรงเลย → ตกถึง rule <code>*</code> → <strong>Deny</strong></li>
              <li>Inbound กับ Outbound มีชุด rule <strong>แยกกัน</strong> และเพราะ NACL เป็น stateless ต้องเขียนขาตอบกลับ (ephemeral ports 1024-65535) เอง</li>
              <li>เว้นระยะเลข rule (100, 200, 300…) เพื่อแทรก rule ใหม่ภายหลังได้</li>
              <li>Default NACL = Allow ทั้งหมด | NACL ที่สร้างใหม่ = Deny ทั้งหมดจนกว่าจะเพิ่ม rule</li>
            </ul>
            <h4>แพ็กเก็ตผ่านด่านไหนก่อนกัน</h4>
            <table>
              <tbody>
                <tr><th>ทิศทาง</th><th>ลำดับ</th></tr>
                <tr><td>ขาเข้า (Inbound)</td><td>Internet → IGW → <strong>NACL</strong> (subnet) → <strong>Security Group</strong> (instance) → instance</td></tr>
                <tr><td>ขาออก (Outbound)</td><td>instance → <strong>Security Group</strong> → <strong>NACL</strong> → IGW/NAT → Internet</td></tr>
              </tbody>
            </table>
            <p>ต้อง <strong>ผ่านทั้งสองด่าน</strong> ถึงจะถึงปลายทาง — ด่านใดด่านหนึ่งปฏิเสธ = ไม่ผ่าน (เช่น NACL อนุญาตแต่ SG ไม่เปิดพอร์ต ก็เข้าไม่ได้)</p>
            <div className="tip">หลักจำ: SG = ไม่มีลำดับ มีแต่ Allow (ตรง rule ใดก็ผ่าน) | NACL = เลขน้อยก่อน เจอตรงแล้วหยุด (Deny ต้องเลขน้อยกว่า Allow ที่ทับซ้อน) | ขาเข้า NACL→SG, ขาออก SG→NACL</div>
            <p className="trap">กับดัก: ข้อสอบมักให้ NACL มี Allow เลข 100 และ Deny เลข 200 สำหรับ IP เดียวกัน แล้วถามว่าทำไมยังบล็อกไม่ได้ → เพราะ Allow ถูกเช็กก่อน | ทราฟฟิกระหว่าง instance ใน subnet เดียวกัน <strong>ไม่ผ่าน NACL</strong> (ผ่านแค่ SG)</p>
          </>
        ),
      },
      {
        title: "VPC Endpoints — เข้า AWS service โดยไม่ออกอินเทอร์เน็ต",
        body: (
          <>
            <p>ให้ resource ใน VPC เรียก AWS service ผ่าน <strong>เครือข่ายส่วนตัวของ AWS</strong> แทนการวิ่งผ่าน Internet Gateway/NAT — ปลอดภัยกว่าและมักถูกกว่า</p>
            <table>
              <tbody>
                <tr><th></th><th>Gateway Endpoint</th><th>Interface Endpoint (AWS PrivateLink)</th></tr>
                <tr><td>รองรับ</td><td><strong>S3 และ DynamoDB เท่านั้น</strong></td><td>AWS service จำนวนมาก (SQS, SNS, Kinesis, API Gateway ฯลฯ) และ service ที่เรา/พาร์ตเนอร์เปิดผ่าน PrivateLink</td></tr>
                <tr><td>วิธีทำงาน</td><td>เพิ่ม <strong>route</strong> ใน route table (ชี้ prefix list ของ service)</td><td>สร้าง <strong>ENI พร้อม private IP</strong> ใน subnet ของเรา</td></tr>
                <tr><td>ค่าใช้จ่าย</td><td><strong>ฟรี</strong></td><td>คิดเงินรายชั่วโมง + ตามข้อมูลที่ผ่าน</td></tr>
                <tr><td>เข้าถึงจาก on-prem / VPC peering</td><td>ไม่ได้ (ใช้ได้เฉพาะภายใน VPC)</td><td>ได้ (ผ่าน Direct Connect / VPN)</td></tr>
                <tr><td>ควบคุม</td><td>Endpoint policy</td><td>Security Group + Endpoint policy</td></tr>
              </tbody>
            </table>
            <ul>
              <li>Use case คลาสสิก: instance ใน private subnet อ่านเขียน S3/DynamoDB — ใช้ <strong>Gateway Endpoint</strong> แทนการวิ่งผ่าน NAT Gateway (ประหยัดค่า NAT และข้อมูลไม่ออกอินเทอร์เน็ต)</li>
              <li><strong>Endpoint policy</strong> จำกัดว่า endpoint นี้เข้าถึง bucket/resource ไหนได้บ้าง</li>
              <li>ต้องการเปิด service ของเราให้ VPC/account อื่นใช้แบบส่วนตัวโดยไม่ต้อง peering → <strong>PrivateLink</strong> (Interface endpoint ฝั่งผู้ใช้ + NLB ฝั่งผู้ให้บริการ)</li>
            </ul>
            <div className="tip">หลักจำ: S3 / DynamoDB จาก private subnet แบบฟรี → Gateway Endpoint | service อื่น หรือต้องเข้าจาก on-prem → Interface Endpoint (PrivateLink)</div>
          </>
        ),
      },
    ],
  },
  {
    id: "storage",
    title: "Storage & Migration",
    cards: [
      {
        title: "Storage Gateway vs DataSync vs DMS",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ใช้เมื่อ</th></tr>
                <tr><td>Storage Gateway</td><td>ต้องการ <strong>continuous/hybrid access</strong> จาก on-prem ไป S3-backed storage (File/Volume/Tape Gateway)</td></tr>
                <tr><td>DataSync</td><td><strong>ย้ายไฟล์/object จำนวนมาก</strong> แบบรวดเร็ว อัตโนมัติ ครั้งเดียวหรือตามตาราง (ไม่ตระหนักเรื่อง schema)</td></tr>
                <tr><td>DMS</td><td>ย้าย <strong>database</strong> ที่ตระหนัก schema/transaction — Full Load + CDC (Change Data Capture)</td></tr>
              </tbody>
            </table>
            <p>DMS CDC-only mode ยิงเข้า <strong>Kinesis Data Streams</strong> ได้ ใช้แก้ปัญหา RDS ที่ไม่มี native stream</p>
            <div className="tip">หลักจำ: ไฟล์ล้วนๆ จำนวนมาก → DataSync | มี schema/transaction → DMS | ต้องเข้าถึงต่อเนื่องจาก on-prem → Storage Gateway</div>
          </>
        ),
      },
    ],
  },
  {
    id: "storage-services",
    title: "Storage Services (S3 / EBS / EFS / FSx)",
    cards: [
      {
        title: "เลือก Storage ให้ถูกกับโจทย์ (ตารางเปรียบเทียบ)",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ประเภท</th><th>เข้าถึงผ่าน</th><th>ขอบเขต</th></tr>
                <tr><td><strong>S3</strong></td><td>Object storage</td><td>HTTP API / SDK (ไม่ใช่ mount เป็นดิสก์)</td><td>Regional (กระจายหลาย AZ)</td></tr>
                <tr><td><strong>EBS</strong></td><td>Block storage</td><td>Attach กับ EC2 เป็นดิสก์</td><td>ผูกกับ <strong>AZ เดียว</strong></td></tr>
                <tr><td><strong>EFS</strong></td><td>File storage (NFS)</td><td>Mount ได้จาก EC2/ECS/EKS/Lambda หลายตัวพร้อมกัน (Linux)</td><td>Regional (Multi-AZ) หรือ One Zone</td></tr>
                <tr><td><strong>FSx</strong></td><td>Managed file system (Windows/Lustre/ONTAP/OpenZFS)</td><td>SMB / Lustre / NFS / iSCSI ตามชนิด</td><td>Single-AZ หรือ Multi-AZ ตามชนิด</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: เก็บไฟล์/object แบบไม่จำกัด → S3 | ดิสก์ของ EC2 ตัวเดียว → EBS | แชร์ไฟล์ Linux หลายเครื่อง → EFS | Windows/SMB, HPC, NetApp → FSx</div>
          </>
        ),
      },
      {
        title: "Amazon S3 — พื้นฐานและความทนทาน",
        body: (
          <>
            <ul>
              <li>Object storage ไม่จำกัดความจุ ขนาด object สูงสุด <strong>5 TB</strong> (อัปโหลดครั้งเดียวผ่าน PUT ได้ไม่เกิน 5 GB — ไฟล์ใหญ่ให้ใช้ <strong>Multipart Upload</strong>)</li>
              <li>Durability <strong>99.999999999% (11 nines)</strong> — ข้อมูลกระจายหลาย AZ (ยกเว้น One Zone classes)</li>
              <li>Bucket ชื่อต้อง unique ทั่วโลก แต่ตัว bucket อยู่ใน region ที่เลือก</li>
              <li><strong>Strong read-after-write consistency</strong> — เขียนเสร็จ อ่านเห็นข้อมูลล่าสุดทันที (ไม่ต้องกังวล eventual consistency แบบเก่า)</li>
              <li>ไม่ใช่ file system — แก้ไขไฟล์บางส่วนไม่ได้ ต้องอัปโหลด object ใหม่ทั้งก้อน และ mount เป็นดิสก์โดยตรงไม่ได้</li>
            </ul>
            <p className="trap">กับดัก: ถ้าโจทย์ต้องการ &quot;ดิสก์ที่ EC2 boot ได้&quot; หรือ &quot;แชร์ไฟล์แบบ POSIX&quot; ไม่ใช่ S3 — นึกถึง EBS / EFS</p>
          </>
        ),
      },
      {
        title: "S3 Storage Classes — เลือกตามความถี่การเข้าถึง",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Class</th><th>เหมาะกับ</th><th>จุดสำคัญ</th></tr>
                <tr><td>Standard</td><td>ข้อมูลที่เข้าถึงบ่อย</td><td>Low latency, หลาย AZ, ไม่มีขั้นต่ำเรื่องระยะเวลาเก็บ</td></tr>
                <tr><td>Intelligent-Tiering</td><td>รูปแบบการเข้าถึงไม่แน่นอน/เปลี่ยนไปมา</td><td>ย้าย tier ให้อัตโนมัติ ไม่มีค่า retrieval แต่มีค่า monitoring ต่อ object</td></tr>
                <tr><td>Standard-IA</td><td>เข้าถึงไม่บ่อย แต่ต้องการเร็วเมื่อใช้</td><td>เก็บขั้นต่ำ 30 วัน, คิดขั้นต่ำ 128 KB/object, มีค่า retrieval</td></tr>
                <tr><td>One Zone-IA</td><td>ข้อมูลสร้างซ้ำได้/สำเนารอง ราคาถูกลง</td><td><strong>AZ เดียว</strong> — AZ ล่มข้อมูลอาจหาย</td></tr>
                <tr><td>Glacier Instant Retrieval</td><td>Archive ที่ยังต้องดึงเร็ว (มิลลิวินาที)</td><td>เก็บขั้นต่ำ 90 วัน</td></tr>
                <tr><td>Glacier Flexible Retrieval</td><td>Archive ที่รอได้เป็นนาที-ชั่วโมง</td><td>Expedited 1-5 นาที / Standard 3-5 ชม. / Bulk 5-12 ชม., เก็บขั้นต่ำ 90 วัน</td></tr>
                <tr><td>Glacier Deep Archive</td><td>เก็บระยะยาวถูกที่สุด (compliance)</td><td>ดึงข้อมูลภายใน ~12 ชม. (Bulk ~48 ชม.), เก็บขั้นต่ำ 180 วัน</td></tr>
              </tbody>
            </table>
            <p><strong>Lifecycle Policy</strong> ใช้ย้าย class (Transition) หรือลบ (Expiration) อัตโนมัติตามอายุ object เช่น 30 วัน → Standard-IA, 90 วัน → Glacier, 365 วัน → ลบ</p>
            <div className="tip">หลักจำ: ไม่รู้ pattern การเข้าถึง → Intelligent-Tiering | ถูกที่สุดสำหรับ archive ยาวๆ → Deep Archive | ต้องดึงเป็นมิลลิวินาทีแต่เข้าถึงน้อย → Glacier Instant Retrieval</div>
          </>
        ),
      },
      {
        title: "โจทย์ S3 Cost-Optimized — เลือก Class ตามเงื่อนไข + Lifecycle แยก Prefix",
        body: (
          <>
            <p>อ่านโจทย์เป็นเงื่อนไขทีละข้อ แล้วจับคู่กับ class ที่ถูกที่สุดที่ยังตรงทุกข้อ</p>
            <table>
              <tbody>
                <tr><th>คำใบ้ในโจทย์</th><th>ความหมาย / เลือก</th></tr>
                <tr><td>ไฟล์ <strong>easily reproducible / สร้างใหม่ได้ง่าย / สำเนารอง</strong></td><td>ไม่ต้องจ่ายค่าทนทานข้าม AZ → <strong>One Zone-IA</strong> (ถูกกว่า Standard-IA)</td></tr>
                <tr><td>เดือนแรกเข้าถึงบ่อย แล้วไม่บ่อย</td><td>เก็บ Standard ก่อน แล้วใช้ <strong>Lifecycle policy</strong> ย้าย class หลัง 30 วัน</td></tr>
                <tr><td>ต้องดึง <strong>ระดับมิลลิวินาที</strong></td><td>ต้องเป็น class ที่ดึงได้ทันที: Standard-IA / One Zone-IA / Glacier Instant Retrieval (<strong>ห้าม</strong> Glacier Flexible / Deep Archive)</td></tr>
                <tr><td><strong>ไม่มีข้อกำหนดเวลาดึง</strong> / ยอมรอได้</td><td>ส่งไป <strong>Glacier</strong> (ถูกกว่า)</td></tr>
                <tr><td>เฉพาะ <strong>prefix</strong> ที่ต้องการแบบหนึ่ง ส่วนที่เหลือแบบอื่น</td><td>ตั้ง Lifecycle rule <strong>แยกตาม prefix (filter)</strong> ไม่ย้ายทั้ง bucket</td></tr>
                <tr><td>ข้อมูลสำคัญ ห้ามหาย + เข้าถึงไม่บ่อย</td><td><strong>Standard-IA</strong> (หลาย AZ)</td></tr>
              </tbody>
            </table>
            <p><strong>ตัวอย่างโจทย์:</strong> ไฟล์ทำซ้ำได้ง่าย เดือนแรกเข้าบ่อย หลังจากนั้นไม่บ่อย ไฟล์เก่าเฉพาะ developer เข้าถึงและไม่มีข้อกำหนดเวลาดึง แต่ prefix <code>tdojo-finance</code> ต้องดึงระดับ ms → หลัง 30 วัน: prefix <code>tdojo-finance</code> → <strong>One Zone-IA</strong> | ส่วนที่เหลือ → <strong>Glacier</strong> (ด้วย Lifecycle policy)</p>
            <div className="tip">หลักจำ: reproducible + เข้าถึงน้อย + ต้องเร็ว → One Zone-IA | ยอมรอได้ → Glacier | ต่าง prefix ต่าง class → Lifecycle rule ตาม prefix | เกือบถูกแต่ใช้ Standard-IA ทั้งที่ทำซ้ำได้ = แพงกว่าที่จำเป็น</div>
            <p className="trap">กับดัก: Intelligent-Tiering มีค่า monitoring และไม่ใช่ตัวที่ถูกที่สุดเมื่อรู้ pattern การเข้าถึงอยู่แล้ว | One Zone-IA ใช้กับข้อมูลที่ &quot;หายแล้วสร้างใหม่ได้&quot; เท่านั้น | ถ้าต้องดึงระดับ ms ห้ามส่งเข้า Glacier Flexible / Deep Archive</p>
          </>
        ),
      },
      {
        title: "S3 Security & Data Protection",
        body: (
          <>
            <ul>
              <li><strong>Block Public Access</strong> — สวิตช์ป้องกัน bucket/object หลุดเป็น public ระดับ account หรือ bucket</li>
              <li><strong>Bucket Policy</strong> (resource-based) กำหนดว่าใครเข้าถึง bucket ได้ รวมถึง cross-account; ACL เป็นระบบเก่า แนะนำใช้ policy แทน</li>
              <li><strong>Encryption at rest</strong>: SSE-S3 (S3 จัดการ key — เปิดเป็นค่าเริ่มต้นกับ object ใหม่), SSE-KMS (คุม key + audit ผ่าน CloudTrail), SSE-C (ลูกค้าส่ง key เอง), หรือ client-side encryption</li>
              <li><strong>Versioning</strong> — เก็บทุกเวอร์ชัน กันลบ/เขียนทับพลาด (ลบแล้วเป็น delete marker ไม่ได้หายจริง); เสริมด้วย <strong>MFA Delete</strong></li>
              <li><strong>Object Lock</strong> (WORM) — Governance mode (ผู้มีสิทธิ์พิเศษยังข้ามได้) vs Compliance mode (ไม่มีใครลบ/แก้ได้ แม้ root จนกว่าครบกำหนด)</li>
              <li><strong>Pre-signed URL</strong> — ให้สิทธิ์ชั่วคราวแก่คนที่ไม่มี AWS credential เข้าถึง/อัปโหลด object เฉพาะตัว</li>
            </ul>
            <p className="trap">กับดัก: ต้องการ &quot;ห้ามลบ/แก้ไขแม้ admin&quot; เพื่อ compliance → Object Lock แบบ Compliance mode (ไม่ใช่แค่ Versioning)</p>
          </>
        ),
      },
      {
        title: "S3 Object Lock (WORM) & Glacier Vault Lock",
        body: (
          <>
            <p>กันไม่ให้ object ถูก <strong>ลบหรือเขียนทับ</strong> ตามช่วงเวลาที่กำหนด (Write Once Read Many) — ใช้กับข้อกำหนด compliance/audit ที่ต้องเก็บข้อมูลห้ามแก้</p>
            <ul>
              <li>ต้องเปิด <strong>Versioning</strong> (Object Lock ล็อกที่ระดับ <strong>object version</strong> ไม่ใช่ทั้ง bucket) — ตั้ง default retention ระดับ bucket ได้</li>
              <li>มี 2 วิธีป้องกัน ใช้แยกกันหรือรวมกันได้: <strong>Retention period</strong> และ <strong>Legal hold</strong></li>
            </ul>
            <table>
              <tbody>
                <tr><th></th><th>Governance mode</th><th>Compliance mode</th></tr>
                <tr><td>ผู้ใช้ทั่วไป</td><td>ลบ/เขียนทับไม่ได้</td><td>ลบ/เขียนทับไม่ได้</td></tr>
                <tr><td>ผู้มีสิทธิ์พิเศษ</td><td>ข้ามได้ ถ้ามี <code>s3:BypassGovernanceRetention</code> และส่ง header bypass</td><td><strong>ไม่มีใครข้ามได้ แม้ root account</strong></td></tr>
                <tr><td>ย่น/ยกเลิก retention</td><td>ทำได้ (ถ้ามีสิทธิ์)</td><td><strong>ทำไม่ได้</strong> จนกว่าจะครบกำหนด</td></tr>
                <tr><td>เหมาะกับ</td><td>ป้องกันการลบพลาด / ทดลองก่อนใช้จริง</td><td>กฎหมาย/ระเบียบที่ต้องห้ามแก้เด็ดขาด</td></tr>
              </tbody>
            </table>
            <ul>
              <li><strong>Retention period</strong> — ล็อกตามช่วงเวลาที่กำหนด (วัน/ปี) พอครบกำหนดจึงลบได้</li>
              <li><strong>Legal hold</strong> — ล็อก <strong>ไม่มีวันหมดอายุ</strong> จนกว่าจะมีคนถอด (ต้องมี <code>s3:PutObjectLegalHold</code>) เหมาะกับคดี/การสืบสวน และ <strong>ไม่ผูกกับ retention mode</strong></li>
              <li><strong>S3 Glacier Vault Lock</strong> — ล็อก <strong>vault access policy</strong> ของ S3 Glacier (ระดับ vault) เมื่อ lock จริงแล้ว <strong>แก้ไข/ลบ policy ไม่ได้อีก</strong> (มีช่วงทดสอบ 24 ชม. ก่อนยืนยัน)</li>
            </ul>
            <div className="tip">หลักจำ: ห้ามลบแม้ admin/root → Compliance mode | ล็อกไม่มีกำหนดวันหมด (เช่น คดีความ) → Legal hold | บังคับ policy WORM ทั้ง Glacier vault → Vault Lock</div>
            <p className="trap">กับดัก: Versioning และ MFA Delete ไม่ได้ทำให้ &quot;ห้ามลบ&quot; จริง (ผู้มีสิทธิ์ยังลบ version ได้) | Governance mode ไม่ใช่คำตอบเมื่อโจทย์บอกว่า &quot;แม้ root ก็ห้าม&quot;</p>
          </>
        ),
      },
      {
        title: "การให้สิทธิ์เข้าถึง S3 — Pre-signed URL, CloudFront Signed URL / Cookies",
        body: (
          <>
            <h4>1) S3 Pre-signed URL</h4>
            <ul>
              <li>สร้างลิงก์ชั่วคราวให้คน <strong>ที่ไม่มี AWS credential</strong> ดาวน์โหลด (GET) หรืออัปโหลด (PUT) object <strong>เฉพาะไฟล์นั้น</strong> — bucket ยัง private ได้</li>
              <li>สิทธิ์ที่ได้ = <strong>สิทธิ์ของผู้ที่ sign</strong> (IAM user/role) ณ ตอนใช้งาน ถ้าผู้ sign ไม่มีสิทธิ์ ลิงก์ก็ใช้ไม่ได้</li>
              <li>มีวันหมดอายุ — IAM user ตั้งได้นานสุด <strong>7 วัน</strong> | ถ้า sign ด้วย role/STS ลิงก์จะ <strong>หมดอายุเมื่อ temporary credential หมด</strong> แม้ตั้งไว้ยาวกว่า</li>
              <li><strong>Pre-signed POST</strong> — ใช้กับฟอร์มอัปโหลดผ่านเบราว์เซอร์ กำหนดเงื่อนไขได้ (ขนาดไฟล์, content-type)</li>
              <li>Use case: ผู้ใช้ดาวน์โหลดไฟล์ส่วนตัวครั้งเดียว, เว็บให้ผู้ใช้อัปโหลดตรงเข้า S3 โดยไม่ผ่าน server ตัวเอง</li>
            </ul>
            <h4>2) CloudFront Signed URL vs Signed Cookies</h4>
            <p>ใช้เมื่อเนื้อหาอยู่หลัง CloudFront และต้องการให้ <strong>เฉพาะผู้ใช้ที่ผ่านการตรวจสอบ</strong> เข้าถึงได้ (เช่น สมาชิกที่จ่ายเงิน) พร้อมได้ cache/edge ของ CloudFront</p>
            <table>
              <tbody>
                <tr><th></th><th>Signed URL</th><th>Signed Cookies</th></tr>
                <tr><td>ขอบเขต</td><td><strong>1 ไฟล์ต่อ 1 URL</strong></td><td><strong>หลายไฟล์ / ทั้งชุด</strong> (เช่น วิดีโอ HLS ที่แบ่งเป็นหลายชิ้น, ทั้งส่วนสมาชิก)</td></tr>
                <tr><td>เปลี่ยน URL ที่ใช้อยู่ไหม</td><td>ต้องเปลี่ยน (ต่อ query string/signature)</td><td><strong>ไม่ต้องเปลี่ยน URL</strong></td></tr>
                <tr><td>เหมาะกับ</td><td>ลิงก์ดาวน์โหลดไฟล์เดียว, client ที่ไม่รองรับ cookie</td><td>เว็บ/แอปที่ผู้ใช้เปิดหลายไฟล์ต่อเนื่อง</td></tr>
              </tbody>
            </table>
            <ul>
              <li>ทั้งสองแบบกำหนด <strong>วันหมดอายุ</strong> ได้ และแบบ custom policy กำหนดช่วงเวลาเริ่มต้นและ <strong>IP range</strong> ของผู้ใช้ได้</li>
              <li>สร้างลายเซ็นด้วย <strong>key ใน trusted key group</strong> (แบบแนะนำ แทนการใช้ key ของ root account)</li>
              <li>ใช้ร่วมกับ <strong>Origin Access Control (OAC)</strong> เพื่อให้ S3 รับ request เฉพาะจาก CloudFront (OAI เป็นแบบเก่า) — ผู้ใช้จึงเข้า S3 ตรงๆ ไม่ได้ ต้องผ่าน signed URL/cookie เท่านั้น</li>
            </ul>
            <h4>เทียบสั้นๆ</h4>
            <table>
              <tbody>
                <tr><th>โจทย์</th><th>ตอบ</th></tr>
                <tr><td>ให้ลิงก์ชั่วคราวเข้า object ใน S3 โดยตรง</td><td>S3 Pre-signed URL</td></tr>
                <tr><td>เนื้อหาหลัง CloudFront ให้เฉพาะสมาชิก — ไฟล์เดียว</td><td>CloudFront Signed URL</td></tr>
                <tr><td>เนื้อหาหลัง CloudFront ให้เฉพาะสมาชิก — หลายไฟล์ ไม่อยากเปลี่ยน URL</td><td>CloudFront Signed Cookies</td></tr>
                <tr><td>บังคับให้เข้า S3 ผ่าน CloudFront เท่านั้น</td><td>OAC (+ bucket policy)</td></tr>
                <tr><td>เปิดให้ account อื่นเข้า bucket</td><td>Bucket policy (cross-account)</td></tr>
                <tr><td>แบ่งสิทธิ์รายทีม/แอปบน bucket ใหญ่</td><td>S3 Access Points</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: ไฟล์เดียว → URL | หลายไฟล์ ไม่เปลี่ยน URL → Cookies | Signed URL/Cookies ของ CloudFront ≠ Pre-signed URL ของ S3 (คนละตัว)</div>
            <p className="trap">กับดัก: อย่าเปิด bucket เป็น public เพื่อแชร์ไฟล์ → ใช้ pre-signed URL หรือ CloudFront signed URL/cookies | ลิงก์ที่ sign ด้วย role หมดอายุตาม session ของ role</p>
          </>
        ),
      },
      {
        title: "S3 Replication, Performance & Event",
        body: (
          <>
            <ul>
              <li><strong>Replication</strong>: CRR (ข้าม region — DR/latency) และ SRR (region เดียวกัน — รวม log/แยก account); ต้อง <strong>เปิด Versioning ทั้งสอง bucket</strong> และจะ replicate เฉพาะ object ใหม่หลังเปิด (ของเก่าใช้ S3 Batch Replication)</li>
              <li><strong>Transfer Acceleration</strong> — อัปโหลดผ่าน CloudFront edge location ใกล้ผู้ใช้ เหมาะกับผู้ใช้ไกลจาก region</li>
              <li><strong>Multipart Upload</strong> — แบ่งไฟล์ใหญ่เป็นส่วนๆ อัปโหลดขนาน เร็วขึ้นและ retry เฉพาะส่วนที่พลาด (แนะนำเมื่อไฟล์เกิน ~100 MB)</li>
              <li><strong>Event Notifications</strong> — ยิง event (เช่น ObjectCreated) ไปที่ SQS / SNS / Lambda / EventBridge</li>
              <li><strong>Requester Pays</strong> — ให้ผู้ดาวน์โหลดจ่ายค่า transfer แทนเจ้าของ bucket</li>
            </ul>
            <div className="tip">หลักจำ: DR ข้าม region → CRR | ผู้ใช้ไกลอัปโหลดช้า → Transfer Acceleration | ไฟล์ใหญ่ → Multipart Upload</div>
          </>
        ),
      },
      {
        title: "Amazon EBS — Block Storage ของ EC2",
        body: (
          <>
            <ul>
              <li>ผูกกับ <strong>AZ เดียว</strong> (replicate ภายใน AZ) — attach ได้กับ EC2 ใน AZ เดียวกันเท่านั้น</li>
              <li>ปกติ attach ได้ทีละ 1 instance — ยกเว้น <strong>Multi-Attach</strong> ของ io1/io2 (สูงสุด 16 Nitro instances ใน AZ เดียวกัน)</li>
              <li><strong>Snapshot</strong> เป็นแบบ incremental เก็บใน S3 (ที่ AWS จัดการ) — ใช้ย้ายข้าม AZ/Region ได้: snapshot → สร้าง volume ใหม่ใน AZ/Region ปลายทาง</li>
              <li>Root volume default <strong>ลบตอน terminate instance</strong> ส่วน volume เพิ่มเติม default ไม่ลบ (ปรับได้ด้วย Delete on Termination)</li>
              <li>เข้ารหัสด้วย KMS ได้ — snapshot ของ volume ที่เข้ารหัสจะเข้ารหัสเสมอ</li>
              <li><strong>Data Lifecycle Manager (DLM)</strong> ตั้งเวลา snapshot อัตโนมัติ</li>
            </ul>
            <table>
              <tbody>
                <tr><th>Volume type</th><th>กลุ่ม</th><th>ใช้เมื่อ</th></tr>
                <tr><td>gp3 / gp2</td><td>General Purpose SSD</td><td>งานทั่วไป boot volume, dev/test — gp3 ตั้ง IOPS/throughput แยกจากขนาดได้ (baseline 3,000 IOPS)</td></tr>
                <tr><td>io1 / io2</td><td>Provisioned IOPS SSD</td><td>database ที่ต้อง IOPS สูงและสม่ำเสมอ, <strong>Multi-Attach</strong> (io2 Block Express ทนทานสูงสุด 99.999%)</td></tr>
                <tr><td>st1</td><td>Throughput Optimized HDD</td><td>งาน sequential throughput สูง เช่น big data, log processing, data warehouse</td></tr>
                <tr><td>sc1</td><td>Cold HDD</td><td>ราคาถูกที่สุด ข้อมูลเข้าถึงไม่บ่อย</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: st1 และ sc1 (HDD) ใช้เป็น <strong>boot volume ไม่ได้</strong> — boot ได้เฉพาะ SSD (gp2/gp3/io1/io2). และ &quot;Spot volume&quot; กับ &quot;SR-IOV volume&quot; ไม่ใช่ EBS type — เป็นคำหลอก (Spot = EC2 pricing, SR-IOV = enhanced networking)</p>
          </>
        ),
      },
      {
        title: "Amazon EFS — Shared File System (NFS) สำหรับ Linux",
        body: (
          <>
            <ul>
              <li>Managed <strong>NFS (v4.1/4.0)</strong> — mount พร้อมกันจาก EC2/ECS/EKS/Lambda <strong>หลายร้อยหลายพันตัว</strong> ได้ ขยายอัตโนมัติ จ่ายตามที่ใช้จริง</li>
              <li><strong>Linux (POSIX) เท่านั้น</strong> — ไม่รองรับ Windows</li>
              <li>Regional (หลาย AZ — ทนทานสูง) หรือ <strong>One Zone</strong> (AZ เดียว ถูกกว่า)</li>
              <li>สร้าง <strong>Mount Target</strong> ต่อ AZ ใน VPC และเปิด Security Group พอร์ต <code>2049</code> (NFS)</li>
              <li><strong>Storage classes + Lifecycle</strong>: Standard → Infrequent Access (IA) → Archive ลดต้นทุนไฟล์ที่ไม่ค่อยแตะ</li>
              <li>Throughput modes: <strong>Elastic</strong> (แนะนำ ปรับอัตโนมัติ), Provisioned, Bursting</li>
              <li>เข้ารหัส at rest (KMS) และ in transit (TLS); ต่อจาก on-prem ได้ผ่าน Direct Connect / VPN</li>
            </ul>
            <p className="trap">กับดัก: โจทย์พูดถึง &quot;หลาย EC2 ใช้ไฟล์ร่วมกัน&quot; + Linux → EFS (EBS ติดได้ทีละตัว) | ถ้าเป็น Windows/SMB/Active Directory → ต้อง FSx for Windows ไม่ใช่ EFS</p>
          </>
        ),
      },
      {
        title: "Amazon FSx — Managed File System 4 แบบ",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>ชนิด</th><th>Protocol</th><th>ใช้เมื่อ</th></tr>
                <tr><td><strong>FSx for Windows File Server</strong></td><td>SMB</td><td>Windows file share, <strong>Active Directory</strong> integration, NTFS/ACL, DFS — migrate file server Windows จาก on-prem; มี Multi-AZ</td></tr>
                <tr><td><strong>FSx for Lustre</strong></td><td>Lustre</td><td><strong>HPC, ML, การประมวลผลที่ต้อง throughput/IOPS สูงมาก</strong> latency ต่ำกว่ามิลลิวินาที; เชื่อมกับ <strong>S3</strong> (โหลดข้อมูลจาก bucket / เขียนผลกลับ)</td></tr>
                <tr><td><strong>FSx for NetApp ONTAP</strong></td><td>NFS, SMB, iSCSI</td><td>ย้ายงาน NetApp จาก on-prem, ต้องการหลาย protocol, snapshot/cloning/dedupe, tiering</td></tr>
                <tr><td><strong>FSx for OpenZFS</strong></td><td>NFS</td><td>ย้ายงาน ZFS จาก on-prem, latency ต่ำ, snapshot/cloning</td></tr>
              </tbody>
            </table>
            <p>FSx for Lustre มี 2 แบบ: <strong>Scratch</strong> (ชั่วคราว ไม่ replicate เร็วสุด ถูก — เหมาะประมวลผลระยะสั้น) vs <strong>Persistent</strong> (ทนทาน replicate ใน AZ — เก็บระยะยาว)</p>
            <div className="tip">หลักจำ: เห็นคำว่า SMB / Active Directory / Windows → FSx Windows | HPC / ML / S3 integration → FSx Lustre | NetApp / iSCSI / หลาย protocol → FSx ONTAP</div>
          </>
        ),
      },
    ],
  },
  {
    id: "database",
    title: "Database",
    cards: [
      {
        title: "เลือก Database ตาม Use Case",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ประเภท</th><th>Use case / keyword ในโจทย์</th></tr>
                <tr><td>RDS</td><td>Relational (OLTP)</td><td>MySQL/PostgreSQL/MariaDB/Oracle/SQL Server แบบ managed — ระบบเดิมที่ต้องการ SQL, join, transaction</td></tr>
                <tr><td>Aurora</td><td>Relational (OLTP)</td><td>MySQL/PostgreSQL compatible แต่ <strong>performance สูงกว่า + HA ดีกว่า</strong> — &quot;high availability&quot;, &quot;global&quot;, &quot;auto-scaling storage&quot;</td></tr>
                <tr><td>DynamoDB</td><td>Key-value / NoSQL</td><td>Serverless, latency ระดับ ms ที่ scale ไม่จำกัด — session, shopping cart, gaming, IoT, schema ยืดหยุ่น</td></tr>
                <tr><td>ElastiCache</td><td>In-memory cache</td><td>ลด load DB, cache query, session store, leaderboard — &quot;sub-millisecond&quot;</td></tr>
                <tr><td>Redshift</td><td>Data warehouse (OLAP)</td><td>วิเคราะห์ข้อมูลปริมาณมาก, BI, report, columnar — &quot;analytics&quot;, &quot;complex queries&quot;</td></tr>
                <tr><td>DocumentDB</td><td>Document</td><td>MongoDB-compatible — เก็บ JSON document</td></tr>
                <tr><td>Neptune</td><td>Graph</td><td>ความสัมพันธ์ซับซ้อน — social network, recommendation, fraud detection</td></tr>
                <tr><td>Keyspaces</td><td>Wide-column</td><td>Apache Cassandra-compatible</td></tr>
                <tr><td>Timestream</td><td>Time-series</td><td>IoT sensor, metrics ตามเวลา</td></tr>
                <tr><td>OpenSearch Service</td><td>Search</td><td>Full-text search, log analytics</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: OLTP (ธุรกรรมรายวัน) → RDS/Aurora/DynamoDB | OLAP (วิเคราะห์) → Redshift | ย้าย MongoDB → DocumentDB | ย้าย Cassandra → Keyspaces</div>
          </>
        ),
      },
      {
        title: "RDS Multi-AZ vs Read Replica",
        body: (
          <>
            <table>
              <tbody>
                <tr><th></th><th>Multi-AZ</th><th>Read Replica</th></tr>
                <tr><td>เป้าหมาย</td><td><strong>High availability / failover</strong></td><td><strong>Scale การอ่าน</strong> (read performance)</td></tr>
                <tr><td>Replication</td><td>Synchronous</td><td>Asynchronous (มี replication lag)</td></tr>
                <tr><td>อ่านจาก standby ได้ไหม</td><td>ไม่ได้ (แบบ Multi-AZ instance) — standby รอ failover อย่างเดียว</td><td>ได้ — ใช้ endpoint แยก</td></tr>
                <tr><td>ข้าม region</td><td>ไม่ได้ (คนละ AZ ใน region เดียว)</td><td>ได้ (cross-region read replica)</td></tr>
                <tr><td>Failover</td><td>อัตโนมัติ — DNS endpoint เดิมชี้ไป standby</td><td>ต้อง <strong>promote</strong> เอง กลายเป็น DB แยกอิสระ</td></tr>
              </tbody>
            </table>
            <p><span className="trap">กับดัก:</span> โจทย์บอก &quot;report query ทำให้ production ช้า&quot; → Read Replica ไม่ใช่ Multi-AZ</p>
            <p><span className="correct">ข้อยกเว้น:</span> <strong>Multi-AZ DB cluster</strong> (แบบใหม่) มี standby 2 ตัวที่อ่านได้ — ถ้าโจทย์ไม่ระบุ ให้ถือว่าเป็น Multi-AZ แบบ instance ปกติ</p>
          </>
        ),
      },
      {
        title: "RDS Performance Insights — ลดค่าใช้จ่ายช่วงไม่ใช้งาน",
        body: (
          <>
            <p>Performance Insights ใช้ได้เฉพาะตอน instance <strong>กำลัง run อยู่</strong> (ไม่ใช่ snapshot)</p>
            <p><span className="correct">วิธีถูก:</span> Snapshot → Terminate instance (หยุดจ่าย compute) → <strong>Restore</strong> จาก snapshot ตอนจะใช้งานจริง</p>
            <p><span className="trap">กับดัก:</span> mysqldump ไปวิเคราะห์บนเครื่อง local — เสีย Performance Insights ไปเลย และ environment ไม่เหมือนจริง</p>
            <div className="tip">&quot;Restart&quot; = instance เดิมที่ยังมีอยู่ | &quot;Restore&quot; = สร้าง instance ใหม่จาก snapshot หลัง terminate ไปแล้ว</div>
          </>
        ),
      },
      {
        title: "DynamoDB Global Table vs Global Secondary Index",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Global Table</th><th>Global Secondary Index (GSI)</th></tr>
                <tr><td>Replicate ข้าม <strong>region</strong> — ใช้สำหรับ DR</td><td>Index เพิ่มเติม <strong>region เดียวกัน</strong> — ไม่เกี่ยวกับ DR</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดักชื่อคล้าย — &quot;Global&quot; ใน GSI ไม่ได้แปลว่า multi-region</p>
          </>
        ),
      },
      {
        title: "Amazon Aurora — จุดเด่นที่ออกสอบ",
        body: (
          <>
            <ul>
              <li>Storage เก็บ <strong>6 copies ใน 3 AZ</strong> และขยายอัตโนมัติ (ไม่ต้องกำหนดขนาดล่วงหน้า)</li>
              <li><strong>Aurora Replicas</strong> ได้สูงสุด 15 ตัว ใช้ทั้งอ่านและเป็นเป้าหมาย failover อัตโนมัติ</li>
              <li>Endpoint: <strong>Writer</strong> (ชี้ไป primary เสมอ), <strong>Reader</strong> (load balance ไปยัง replica), <strong>Custom</strong> (กลุ่ม replica ที่เลือกเอง เช่น สำหรับ analytics)</li>
              <li><strong>Aurora Global Database</strong> — replicate ข้าม region แบบ lag ปกติต่ำกว่า 1 วินาที, RPO ~1 วินาที, RTO &lt; 1 นาที</li>
              <li><strong>Aurora Serverless v2</strong> — scale capacity อัตโนมัติ เหมาะกับ workload ที่คาดเดาไม่ได้หรือใช้เป็นช่วงๆ</li>
              <li><strong>Backtrack</strong> (Aurora MySQL) — ย้อน DB กลับไปเวลาก่อนหน้าโดยไม่ต้อง restore จาก backup</li>
              <li><strong>Cloning</strong> — สร้าง DB copy สำหรับ test ได้เร็ว (copy-on-write ไม่ต้อง copy ข้อมูลทั้งหมด)</li>
            </ul>
            <div className="tip">หลักจำ: DR ข้าม region ของ relational DB ที่ต้องการ RPO/RTO ต่ำมาก → Aurora Global Database</div>
          </>
        ),
      },
      {
        title: "DynamoDB — Capacity, DAX, Streams, TTL",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>ฟีเจอร์</th><th>ใช้เมื่อ</th></tr>
                <tr><td>On-Demand capacity</td><td>Traffic คาดเดาไม่ได้ / workload ใหม่ — จ่ายตาม request</td></tr>
                <tr><td>Provisioned + Auto Scaling</td><td>Traffic คาดเดาได้ — ถูกกว่าเมื่อใช้งานสม่ำเสมอ</td></tr>
                <tr><td><strong>DAX</strong> (DynamoDB Accelerator)</td><td>Cache ในตัวของ DynamoDB อ่านเร็วระดับ <strong>microsecond</strong> — แทบไม่ต้องแก้โค้ด</td></tr>
                <tr><td><strong>DynamoDB Streams</strong></td><td>จับการเปลี่ยนแปลงของ item (เก็บ 24 ชม.) → trigger Lambda เช่น ส่ง email เมื่อมี order ใหม่</td></tr>
                <tr><td><strong>TTL</strong></td><td>ลบ item ที่หมดอายุอัตโนมัติโดยไม่เสียค่า write — เช่น session หมดอายุ</td></tr>
                <tr><td>PITR (Point-in-time recovery)</td><td>Restore ไปวินาทีใดก็ได้ภายใน 35 วันย้อนหลัง</td></tr>
              </tbody>
            </table>
            <p><span className="trap">กับดัก:</span> Item ใหญ่ได้สูงสุด <strong>400 KB</strong> — ไฟล์ใหญ่ให้เก็บใน S3 แล้วเก็บแค่ key/URL ใน DynamoDB</p>
            <p><span className="trap">กับดัก:</span> DAX ใช้กับ DynamoDB เท่านั้น — ถ้าเป็น cache ของ RDS ให้ใช้ ElastiCache</p>
          </>
        ),
      },
      {
        title: "ElastiCache: Redis vs Memcached",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Redis (หรือ Valkey)</th><th>Memcached</th></tr>
                <tr><td>Replication + Multi-AZ failover</td><td>ไม่มี replication</td></tr>
                <tr><td>Persistence / backup ได้</td><td>ไม่มี persistence — ข้อมูลหายเมื่อ node ล่ม</td></tr>
                <tr><td>Data structure ซับซ้อน (sorted set → leaderboard, pub/sub)</td><td>Key-value ธรรมดา</td></tr>
                <tr><td>Single-threaded ต่อ shard</td><td>Multi-threaded — เน้น cache ง่ายๆ ขนาดใหญ่</td></tr>
              </tbody>
            </table>
            <p>Pattern: <strong>Lazy loading</strong> (โหลดเข้า cache เมื่อ miss — ข้อมูลอาจเก่า) vs <strong>Write-through</strong> (เขียน cache พร้อม DB — ข้อมูลใหม่เสมอแต่เปลือง memory) — ใช้ TTL ควบคู่เพื่อลดข้อมูลค้าง</p>
            <div className="tip">หลักจำ: ต้องการ HA / persistence / leaderboard → Redis | cache ง่ายสุด ไม่ต้อง HA → Memcached</div>
          </>
        ),
      },
      {
        title: "RDS Proxy",
        body: (
          <>
            <p>Connection pool แบบ managed อยู่หน้า RDS/Aurora</p>
            <ul>
              <li>แก้ปัญหา <strong>Lambda เปิด connection จำนวนมาก</strong> จน DB รับไม่ไหว (&quot;too many connections&quot;)</li>
              <li>ลดเวลา failover ของ RDS/Aurora เพราะ app เชื่อมกับ proxy ไม่ต้องรอ DNS</li>
              <li>บังคับใช้ IAM authentication และเก็บ credential ใน Secrets Manager ได้</li>
              <li>อยู่ใน VPC เท่านั้น ไม่เปิดให้เข้าจาก internet</li>
            </ul>
          </>
        ),
      },
      {
        title: "RDS Backup & Encryption",
        body: (
          <>
            <ul>
              <li><strong>Automated backup</strong> — เก็บได้ 1–35 วัน, restore แบบ point-in-time ได้ (ไปที่ instance ใหม่เสมอ)</li>
              <li><strong>Manual snapshot</strong> — อยู่จนกว่าจะลบเอง (ใช้เก็บระยะยาวเกิน 35 วัน)</li>
              <li>Encryption at rest ด้วย KMS ต้องเลือก <strong>ตอนสร้าง</strong> เท่านั้น</li>
              <li>Read replica ของ DB ที่ encrypt ต้อง encrypt ด้วย และ DB ที่ไม่ encrypt สร้าง replica ที่ encrypt ไม่ได้</li>
            </ul>
            <p><span className="correct">วิธีเข้ารหัส DB เดิมที่ไม่ได้ encrypt:</span> Snapshot → <strong>Copy snapshot พร้อมเปิด encryption</strong> → Restore เป็น instance ใหม่ → สลับ app ไปใช้</p>
            <p><span className="trap">กับดัก:</span> &quot;เปิด encryption บน instance ที่ run อยู่โดยตรง&quot; ทำไม่ได้</p>
          </>
        ),
      },
      {
        title: "Use Case ตัวอย่าง (แนวโจทย์)",
        body: (
          <table>
            <tbody>
              <tr><th>สถานการณ์</th><th>คำตอบ</th></tr>
              <tr><td>E-commerce ต้องการ SQL + transaction + HA ข้าม AZ</td><td>RDS/Aurora Multi-AZ</td></tr>
              <tr><td>Dashboard/report ทำให้ production DB ช้า</td><td>Read Replica (หรือ Aurora Reader endpoint)</td></tr>
              <tr><td>Mobile game ผู้เล่นหลักล้าน ต้องการ latency ต่ำแบบ serverless</td><td>DynamoDB (+ DAX ถ้าอ่านหนัก)</td></tr>
              <tr><td>Leaderboard แบบ real-time</td><td>ElastiCache Redis (sorted set)</td></tr>
              <tr><td>เก็บ user session ของเว็บที่มีหลาย EC2 หลัง load balancer</td><td>ElastiCache หรือ DynamoDB</td></tr>
              <tr><td>แอป global ต้องอ่าน/เขียนได้ใน region ใกล้ผู้ใช้</td><td>DynamoDB Global Table</td></tr>
              <tr><td>Relational DB ต้องการ DR ข้าม region RPO ~1 วินาที</td><td>Aurora Global Database</td></tr>
              <tr><td>Workload DB ใช้เป็นช่วงๆ คาดเดาไม่ได้ ต้องการลดค่าใช้จ่าย</td><td>Aurora Serverless v2 หรือ DynamoDB On-Demand</td></tr>
              <tr><td>Lambda เชื่อม RDS แล้วเจอ &quot;too many connections&quot;</td><td>RDS Proxy</td></tr>
              <tr><td>ระบบ recommendation / fraud detection จากความสัมพันธ์</td><td>Neptune</td></tr>
              <tr><td>ย้าย MongoDB ขึ้น AWS แบบ managed</td><td>DocumentDB</td></tr>
              <tr><td>วิเคราะห์ข้อมูลยอดขายหลาย TB ด้วย SQL ซับซ้อน</td><td>Redshift (Redshift Spectrum ถ้าข้อมูลอยู่ใน S3)</td></tr>
              <tr><td>Oracle on-prem → Aurora PostgreSQL (คนละ engine)</td><td>SCT (แปลง schema) + DMS (ย้ายข้อมูล)</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "RDS Multi-AZ vs Read Replica และ Multi-AZ ของบริการอื่น",
        body: (
          <>
            <p><strong>โจทย์ตัวอย่าง:</strong> RDS for MySQL ต้อง failover ไป instance สำรองอัตโนมัติเมื่อล่ม และต้อง highly available ที่สุด → ตอบ <strong>เปิด Multi-AZ (สร้าง standby ใน AZ อื่น)</strong></p>
            <table>
              <tbody>
                <tr><th></th><th>Multi-AZ</th><th>Read Replica</th></tr>
                <tr><td>จุดประสงค์</td><td><strong>High availability</strong> (failover)</td><td>กระจายการอ่าน (scale read) / DR</td></tr>
                <tr><td>การ replicate</td><td>Synchronous</td><td>Asynchronous</td></tr>
                <tr><td>Failover</td><td><strong>อัตโนมัติ</strong> (DNS endpoint เดิมชี้ไป standby)</td><td>ไม่อัตโนมัติ ต้อง promote เอง</td></tr>
                <tr><td>รับ query?</td><td>แบบ instance: ไม่ (standby ไว้ failover) | แบบ DB cluster: standby อ่านได้</td><td>รับ SELECT ได้</td></tr>
                <tr><td>ขอบเขต</td><td>Region เดียว (ข้าม AZ)</td><td>AZ เดียวกัน / ข้าม AZ / ข้าม Region ได้</td></tr>
              </tbody>
            </table>
            <h4>Multi-AZ มีแค่ RDS หรือไม่?</h4>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>รูปแบบ</th></tr>
                <tr><td>RDS</td><td>Multi-AZ instance (standby 1 ตัว) หรือ Multi-AZ DB cluster (standby อ่านได้ 2 ตัว สำหรับ MySQL/PostgreSQL)</td></tr>
                <tr><td>Aurora</td><td>storage เก็บ 6 copy ใน 3 AZ อัตโนมัติ + Aurora Replica ใน AZ อื่นเป็นเป้า failover</td></tr>
                <tr><td>ElastiCache (Redis)</td><td>เปิด Multi-AZ + automatic failover (Memcached ไม่มี replication)</td></tr>
                <tr><td>FSx, OpenSearch, Amazon MQ</td><td>เลือกแบบ Multi-AZ / standby ได้</td></tr>
                <tr><td>S3, DynamoDB, SQS, SNS, EFS Standard</td><td>ข้ามหลาย AZ ให้อัตโนมัติ ไม่ต้องตั้ง</td></tr>
                <tr><td>EC2, NAT Gateway</td><td>เราต้องออกแบบกระจาย AZ เอง (ASG หลาย subnet, NAT ต่อ AZ)</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: ตัวเลือกที่เขียนว่า &quot;promote any replica to become primary&quot; คือทำเอง ไม่ใช่ automatic failover | Multi-AZ กัน AZ ล่มได้ แต่ไม่กัน Region ล่ม (ต้องใช้ cross-region replica / snapshot copy / Aurora Global) | สร้าง read replica 5 ตัวไม่ได้ทำให้ HA ขึ้น</p>
            <div className="tip">หลักจำ: &quot;automatic failover / HA&quot; → Multi-AZ | &quot;scale การอ่าน / reporting&quot; → Read Replica | &quot;กัน Region ล่ม&quot; → Cross-Region Replica / Aurora Global Database</div>
          </>
        ),
      },
    ],
  },
  {
    id: "compute-messaging",
    title: "Compute & Messaging",
    cards: [
      {
        title: "Multi-AZ Fault Tolerance (สูตรคำนวณ)",
        body: (
          <>
            <p>ถ้าโจทย์บอก &quot;ต้องมี X instance running ที่ at all times&quot; แม้เสีย AZ ใดไป 1 AZ — หมายถึง <strong>อย่างน้อย X</strong> (minimum) ไม่ใช่ total ไม่เกิน X</p>
            <p>สูตรเช็ค: (รวมทุก AZ) − (AZ ที่มีเครื่องมากที่สุด) ≥ X จึงผ่าน</p>
            <p>ตัวอย่าง ต้องการ 6: (2,2,2)=4 <span className="trap">ไม่ผ่าน</span> | (3,3,3)=6 <span className="correct">ผ่าน</span> | (6,6,0)=6 <span className="correct">ผ่าน</span> (แต่ไม่ best practice เพราะ AZ หนึ่งไม่ได้ใช้เลย)</p>
          </>
        ),
      },
      {
        title: "SQS — Delivery Semantics",
        body: (
          <ul>
            <li><code>ReceiveMessage</code> = ซ่อนข้อความชั่วคราว (visibility timeout) ไม่ได้ลบ</li>
            <li><code>DeleteMessage</code> = ลบจริงหลัง process สำเร็จ</li>
            <li>Standard Queue = <strong>at-least-once</strong> — มีโอกาสซ้ำได้เสมอ ปรับ visibility timeout ได้แค่ &quot;ลด&quot; ความเสี่ยง ไม่ใช่ &quot;กำจัด&quot;</li>
            <li>ต้องการ exactly-once จริง → ใช้ <strong>FIFO Queue</strong> (มี deduplication)</li>
          </ul>
        ),
      },
      {
        title: "SQS — ฟีเจอร์ที่ใช้แก้โจทย์ + Use Case",
        body: (
          <>
            <ul>
              <li><strong>โมเดล pull</strong>: consumer ไปดึงข้อความจากคิวเอง — ใช้ <strong>decouple</strong> ผู้ส่งกับผู้ประมวลผล และ<strong>รับโหลดกระชาก</strong> (buffer) ให้ worker ประมวลผลตามกำลัง</li>
              <li><strong>Standard</strong>: throughput แทบไม่จำกัด, at-least-once, ลำดับแบบ best-effort | <strong>FIFO</strong>: ลำดับเรียงต่อ Message Group + deduplication (exactly-once processing) แต่ throughput จำกัดกว่า</li>
              <li><strong>Visibility Timeout</strong>: ซ่อนข้อความขณะ consumer ประมวลผล — ถ้าประมวลผลนานกว่า timeout ข้อความจะโผล่มาให้คนอื่นอีก (เกิดซ้ำ) ให้ตั้งให้เกินเวลาประมวลผล</li>
              <li><strong>Long polling</strong> (<code>ReceiveMessageWaitTimeSeconds</code> สูงสุด 20 วินาที): รอจนมีข้อความ ลดจำนวน request ว่างเปล่า ลดค่าใช้จ่ายและ latency</li>
              <li><strong>Dead-Letter Queue (DLQ)</strong>: ข้อความที่ประมวลผลล้มเกินจำนวนครั้ง (<code>maxReceiveCount</code>) ถูกย้ายไป DLQ เพื่อตรวจสอบ ไม่วนซ้ำไม่จบ (poison message)</li>
              <li><strong>Delay Queue</strong>: หน่วงข้อความก่อนให้ consumer เห็น สูงสุด 15 นาที</li>
              <li>เก็บข้อความได้ 1 นาที - 14 วัน (ค่าเริ่มต้น 4 วัน); ขนาดข้อความสูงสุด 256 KB — ใหญ่กว่านั้นใช้ <strong>SQS Extended Client Library</strong> เก็บ payload ใน S3 แล้วส่งแค่ pointer</li>
              <li><strong>Auto Scaling ตามคิว</strong>: scale worker (EC2 ASG) ตาม metric จำนวนข้อความค้าง (<code>ApproximateNumberOfMessagesVisible</code> / backlog per instance)</li>
            </ul>
            <p><strong>Use case ตัวอย่าง:</strong> ระบบรับออเดอร์ (เว็บส่งเข้าคิว → worker ค่อยๆ ประมวลผล), งานแปลงรูป/วิดีโอแบบ asynchronous, ส่ง job ให้ worker fleet ที่ scale ได้, กันระบบปลายทางล่มไม่ให้งานหาย</p>
            <p className="trap">กับดัก: ถ้าต้องการให้ &quot;ข้อความเดียวกันไปหลายผู้รับพร้อมกัน&quot; คิวเดียวไม่พอ — แต่ละข้อความถูกประมวลผลโดย consumer ตัวเดียว ต้องใช้ SNS fan-out</p>
          </>
        ),
      },
      {
        title: "SNS — ฟีเจอร์ + Use Case",
        body: (
          <>
            <ul>
              <li><strong>โมเดล publish/subscribe (push)</strong>: ผู้ส่ง publish ลง <strong>Topic</strong> แล้ว SNS ส่งต่อให้ <strong>ทุก subscriber</strong> พร้อมกัน</li>
              <li>Subscriber ได้หลายแบบ: <strong>SQS, Lambda, HTTP/HTTPS endpoint, Email, SMS, Mobile push, Kinesis Data Firehose</strong></li>
              <li><strong>Message Filtering</strong> (filter policy): ให้ subscriber แต่ละตัวรับเฉพาะข้อความที่ตรงเงื่อนไข (ตาม message attribute) — ไม่ต้องแยกหลาย topic</li>
              <li><strong>SNS FIFO topic</strong>: รักษาลำดับ + deduplication (subscribe ได้ด้วย SQS FIFO)</li>
              <li><strong>ไม่เก็บข้อความถาวร</strong>: ส่งออกไปแล้วมี retry policy ตามโปรโตคอล และตั้ง DLQ ให้ subscription ที่ส่งไม่สำเร็จได้</li>
            </ul>
            <p><strong>Use case ตัวอย่าง:</strong> แจ้งเตือนทาง email/SMS เมื่อ CloudWatch alarm ทำงาน, ประกาศเหตุการณ์ (เช่น &quot;ออเดอร์ถูกสร้าง&quot;) ให้หลายระบบรับรู้, ส่ง mobile push notification, แจ้งเตือนจาก Auto Scaling/S3 event</p>
            <div className="tip">หลักจำ: SQS = &quot;คิวให้ใครสักคนมาหยิบไปทำ&quot; (pull, 1 ข้อความ → 1 consumer) | SNS = &quot;ตะโกนบอกทุกคนที่ติดตาม&quot; (push, 1 ข้อความ → ทุก subscriber)</div>
          </>
        ),
      },
      {
        title: "SNS + SQS Fan-out Pattern",
        body: (
          <>
            <p>ผู้ส่ง publish ลง <strong>SNS topic เดียว</strong> แล้วให้ <strong>หลาย SQS queue subscribe</strong> topic นั้น — แต่ละคิวเป็นของแต่ละระบบ ประมวลผลอิสระตามจังหวะของตัวเอง</p>
            <table>
              <tbody>
                <tr><th>ขั้น</th><th>เกิดอะไรขึ้น</th></tr>
                <tr><td>1</td><td>เหตุการณ์เกิดขึ้น (เช่น มีออเดอร์ใหม่) → publish ลง SNS topic</td></tr>
                <tr><td>2</td><td>SNS ส่งสำเนาไปยังทุก SQS queue ที่ subscribe (inventory, shipping, billing, analytics)</td></tr>
                <tr><td>3</td><td>แต่ละระบบมี worker ของตัวเองดึงจากคิวของตัวเอง — ระบบหนึ่งล่ม ข้อความยังรอในคิว ไม่กระทบระบบอื่น</td></tr>
              </tbody>
            </table>
            <ul>
              <li>ข้อดี: <strong>loosely coupled</strong>, ผู้ส่งไม่ต้องรู้จักผู้รับ, เพิ่มระบบใหม่ได้โดยแค่ subscribe, ได้ทั้ง broadcast (SNS) และความทนทาน/retry (SQS)</li>
              <li>ใช้แก้ข้อจำกัดของ <strong>S3 event notification</strong> ที่ส่งไปหลายปลายทางตรงๆ ไม่ได้สะดวก → ส่งเข้า SNS ก่อนแล้ว fan-out (หรือใช้ EventBridge)</li>
              <li>Fan-out แบบเรียงลำดับ: <strong>SNS FIFO topic → SQS FIFO queues</strong></li>
            </ul>
          </>
        ),
      },
      {
        title: "SQS vs SNS vs EventBridge vs Kinesis vs Amazon MQ",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ลักษณะ</th><th>ใช้เมื่อ</th></tr>
                <tr><td><strong>SQS</strong></td><td>Queue, pull, 1 ข้อความ → 1 consumer, ลบเมื่อ process เสร็จ</td><td>Decouple / buffer / งาน asynchronous / worker fleet</td></tr>
                <tr><td><strong>SNS</strong></td><td>Pub/sub, push → หลาย subscriber</td><td>Broadcast, fan-out, แจ้งเตือน email/SMS/push</td></tr>
                <tr><td><strong>EventBridge</strong></td><td>Event bus + rule routing จาก AWS service/SaaS/แอปเรา + schedule</td><td>Event-driven ที่ต้อง route ตามเนื้อหา event หลายเงื่อนไข</td></tr>
                <tr><td><strong>Kinesis Data Streams</strong></td><td>Stream real-time เรียงลำดับตาม shard เก็บย้อนหลังได้ (replay) หลาย consumer อ่านซ้ำได้</td><td>ข้อมูลไหลต่อเนื่องปริมาณสูง เช่น clickstream, log, IoT</td></tr>
                <tr><td><strong>Amazon MQ</strong></td><td>Managed ActiveMQ/RabbitMQ (JMS, AMQP, MQTT, STOMP ฯลฯ)</td><td>ย้ายระบบเดิมที่ใช้ message broker มาตรฐานโดยไม่แก้โค้ด</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: งานค้างให้ worker ทำ → SQS | ประกาศให้ทุกคนรู้ → SNS | ต้องการ replay/stream ปริมาณสูง → Kinesis | ย้าย JMS/AMQP เดิมมา AWS → Amazon MQ</div>
          </>
        ),
      },
      {
        title: "Kinesis Data Streams — Shard, Partition Key และการเรียงลำดับ",
        body: (
          <>
            <ul>
              <li><strong>Shard</strong> = หน่วยย่อยของ stream (&quot;ช่องทาง&quot;หนึ่งช่อง) เป็นทั้ง <strong>หน่วยความจุ</strong> และ <strong>หน่วยที่รับประกันลำดับ</strong> — อยากรับข้อมูลมากขึ้นให้เพิ่มจำนวน shard (split/merge หรือใช้โหมด On-demand)</li>
              <li><strong>Partition key</strong> = ข้อความที่ producer แนบกับ record เพื่อบอกว่าจะไป shard ไหน — Kinesis hash key แล้วแมปไป shard; <strong>key เดียวกัน → shard เดียวกัน → เรียงตามลำดับที่เข้ามา</strong> (แต่ละ record มี sequence number)</li>
              <li><strong>ลำดับรับประกันเฉพาะภายใน shard เดียว</strong> — ข้าม shard ไม่มีลำดับระหว่างกัน; อยากเรียงชุดไหนให้ชุดนั้นใช้ partition key เดียวกัน (เช่น user ID, order ID)</li>
              <li>เลือก key ให้หลากหลายพอ ไม่งั้นเกิด <strong>hot shard</strong> (ข้อมูลกระจุกที่ shard เดียวชนเพดานของ shard)</li>
              <li>ข้อมูล <strong>เก็บไว้ใน stream</strong> (retention เริ่มต้น 24 ชม. ขยายได้) และอ่านซ้ำ/ย้อนหลังได้ — หลาย consumer อ่านพร้อมกันได้ เช่น <strong>EMR</strong>, Lambda, KCL app</li>
              <li><strong>ไม่ใช่ exactly-once</strong>: ถ้า producer retry อาจมี record ซ้ำ ต้องทำ idempotency ที่ฝั่งแอป</li>
            </ul>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ลำดับ</th><th>เก็บ/อ่านซ้ำ</th><th>ใช้เมื่อ</th></tr>
                <tr><td><strong>Kinesis Data Streams</strong></td><td>เรียงตาม shard/partition key</td><td>เก็บไว้ อ่านซ้ำได้</td><td>streaming real-time ต้องเรียงลำดับ + ไม่ทำหาย + ให้ EMR/แอปอ่านเอง</td></tr>
                <tr><td><strong>Data Firehose</strong></td><td>ไม่เน้น</td><td>ไม่เก็บให้อ่านซ้ำ</td><td>ส่งข้อมูลไป S3 / Redshift / OpenSearch ฯลฯ อัตโนมัติ (near real-time) ไม่ต้องเขียน consumer</td></tr>
                <tr><td><strong>SQS Standard</strong></td><td>best-effort</td><td>ลบเมื่อประมวลผลแล้ว</td><td>คิวงาน ไม่ซีเรียสลำดับ (at-least-once จึงอาจซ้ำ)</td></tr>
                <tr><td><strong>SQS FIFO</strong></td><td>เรียงตาม message group ID</td><td>ลบเมื่อประมวลผลแล้ว</td><td>คิวที่ต้องเรียงลำดับ + ไม่ซ้ำ</td></tr>
                <tr><td><strong>SNS</strong></td><td>ไม่รับประกัน</td><td>ไม่เก็บข้อความ</td><td>Broadcast / fan-out</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: เรียงลำดับ + ไม่หาย + streaming + EMR อ่านเอง → Kinesis Data Streams | ลำดับ + ไม่ซ้ำแบบคิวงาน → SQS FIFO | ส่งเข้า S3/Redshift อัตโนมัติ → Firehose | fan-out → SNS</div>
            <p className="trap">กับดัก: SQS standard + DLQ ไม่แก้ปัญหาลำดับและข้อความซ้ำ (DLQ แค่เก็บข้อความที่ประมวลผลล้มเหลว) | Kinesis เรียงลำดับ &quot;ต่อ shard&quot; ไม่ใช่ทั้ง stream</p>
          </>
        ),
      },
      {
        title: "EBS vs Instance Store",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>EBS (Elastic Block Store)</th><th>Instance Store</th></tr>
                <tr><td>Network-attached, <strong>persistent</strong> — ข้อมูลอยู่แม้ stop/terminate instance (ถ้าไม่ตั้งลบ)</td><td>Physically attached กับ host เดิม — <strong>ข้อมูลหายถ้า stop หรือ terminate</strong> (หรือ hardware ล้ม)</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: Instance Store เร็วกว่า (local disk) แต่ใช้เก็บข้อมูลที่ต้อง persistent ไม่ได้เด็ดขาด — เหมาะกับ cache/temp data เท่านั้น</p>
          </>
        ),
      },
    ],
  },
  {
    id: "iam",
    title: "IAM & Security",
    cards: [
      {
        title: "IAM User vs Role vs Policy",
        body: (
          <table>
            <tbody>
              <tr><th>IAM User</th><th>IAM Role</th><th>IAM Policy</th></tr>
              <tr><td>Identity ถาวร มี credential ติดตัว</td><td>สิทธิ์ชั่วคราว ไม่มีเจ้าของตายตัว ใครก็ &quot;สวม&quot; ได้</td><td>เอกสาร JSON กำหนดสิทธิ์ (attach ให้ User/Role/Group)</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "เมื่อไหร่ควรใช้ Role",
        body: (
          <>
            <ul>
              <li>AWS Service ต้องเข้าถึง Service อื่น (EC2 → S3, Lambda → DynamoDB)</li>
              <li>Cross-account access (Account A ให้ Account B assume role เข้ามา)</li>
              <li>Federation (user จากภายนอกไม่มี IAM identity)</li>
              <li>IAM Identity Center (SSO) — เลือก Role ตอน login</li>
              <li>Break-glass / elevated access ชั่วคราว</li>
            </ul>
            <div className="tip">หลักจำ: เจอคำว่า &quot;temporary&quot;, &quot;cross-account&quot;, &quot;service-to-service&quot;, &quot;federation&quot; → นึกถึง Role ก่อน</div>
          </>
        ),
      },
      {
        title: "AWS STS (Security Token Service)",
        body: (
          <>
            <p>ออก credential ชั่วคราว (Access Key, Secret Key, Session Token) ที่หมดอายุอัตโนมัติ</p>
            <p>STS รับ input ได้แค่ 3 แบบ:</p>
            <ul>
              <li>SAML 2.0 assertion → <code>AssumeRoleWithSAML</code></li>
              <li>OIDC token → <code>AssumeRoleWithWebIdentity</code></li>
              <li>Caller ที่ authenticated แล้ว (มี IAM credential + สิทธิ์ <code>sts:AssumeRole</code>)</li>
            </ul>
            <p className="trap">STS ไม่รู้จัก LDAP protocol เลย — เชื่อมตรงไม่ได้ไม่ว่าจะเป็น use case ทั่วไปแค่ไหน</p>
          </>
        ),
      },
      {
        title: "Custom Identity Broker Pattern",
        body: (
          <>
            <p>ใช้เมื่อ identity store (เช่น LDAP) <strong>ไม่รองรับ SAML/OIDC</strong></p>
            <p><code>User → (LDAP auth) → Broker App → (AWS API ด้วย credential ของ broker) → STS → temporary credential → ส่งกลับ user</code></p>
            <p>Broker ทำหน้าที่ &quot;แปลภาษา&quot; ระหว่าง LDAP protocol กับ AWS API</p>
          </>
        ),
      },
      {
        title: "IAM Identity Center (ชื่อเดิม AWS SSO)",
        body: (
          <>
            <p>จุด login เดียวสำหรับเข้าหลาย AWS Account โดยไม่ต้องสร้าง IAM User แยกทุก account</p>
            <ul>
              <li><strong>Identity source</strong> — user จาก Identity Center เองหรือต่อ AD/Okta/Azure AD/Google Workspace</li>
              <li><strong>Permission Set</strong> — แม่แบบสิทธิ์ (เหมือน Policy template)</li>
              <li><strong>Account assignment</strong> — จับคู่ User/Group + Permission Set + Account</li>
            </ul>
            <p className="trap">ต้องการ identity source ที่คุยผ่าน SAML/SCIM ได้ — ถ้า LDAP ไม่รองรับ SAML ต้องใช้ Custom Identity Broker แทน ไม่ใช่ Identity Center</p>
          </>
        ),
      },
      {
        title: "Amazon Cognito (สำหรับแอปของบริษัทเอง ไม่ใช่ AWS Console)",
        body: (
          <ul>
            <li><strong>User Pool</strong> — จัดการ user/login ด้วย email ออก JWT token ให้แอป backend เช็คสิทธิ์ตาม Group</li>
            <li><strong>Identity Pool</strong> — แลก token เป็น temporary AWS credential (ผ่าน Role) เพื่อให้ user เข้าถึง AWS resource ตรงๆ (เช่น upload S3 จาก mobile app)</li>
          </ul>
        ),
      },
      {
        title: "IAM Role vs IAM Group",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>IAM Role</th><th>IAM Group</th></tr>
                <tr><td>สวมได้ชั่วคราว ไม่มี credential ติดตัว ให้ service/คนนอก/คนละ account assume ได้</td><td>แค่ &quot;ตะกร้า&quot; รวม <strong>IAM User</strong> หลายคนไว้ด้วยกัน เพื่อ attach Policy ครั้งเดียวให้ทุกคนในกลุ่ม</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: Group ไม่ใช่ identity ที่ assume ได้ และไม่มี credential ของตัวเอง — เป็นแค่ตัวจัดกลุ่ม User เท่านั้น</p>
          </>
        ),
      },
      {
        title: "Lambda: Execution Role vs Resource-based Policy",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Execution Role</th><th>Resource-based Policy</th></tr>
                <tr><td>สิทธิ์ที่ติดกับ Lambda function เอง — กำหนดว่า Lambda <strong>&quot;ไปทำอะไรกับ service อื่นได้บ้าง&quot;</strong> (เช่น เขียนลง DynamoDB)</td><td>Policy แปะที่ Lambda — กำหนดว่า <strong>&quot;ใครมีสิทธิ์เรียก Lambda นี้ได้บ้าง&quot;</strong> (เช่น ให้ S3 event หรือ API Gateway เรียกได้)</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: Execution Role = Lambda มองออกไปข้างนอก | Resource-based Policy = คนนอกมองเข้ามาที่ Lambda</div>
          </>
        ),
      },
      {
        title: "STS API Actions — เลือกให้ถูกกับใครเป็นคนเรียก",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>API</th><th>ใครเรียก / input</th><th>ใช้เมื่อ</th></tr>
                <tr><td><code>AssumeRole</code></td><td>IAM user/role ที่ authenticated แล้ว (มี AWS credential)</td><td>สวม Role ใน account เดียวกันหรือ <strong>cross-account</strong>, ให้ service/คนนอกขอสิทธิ์ชั่วคราว</td></tr>
                <tr><td><code>AssumeRoleWithSAML</code></td><td>ผู้ใช้ที่มี <strong>SAML assertion</strong> จาก IdP (เช่น AD FS) — ไม่ต้องมี AWS credential</td><td>Enterprise federation ผ่าน SAML 2.0</td></tr>
                <tr><td><code>AssumeRoleWithWebIdentity</code></td><td>ผู้ใช้ที่มี <strong>OIDC token</strong> (Google, Facebook, Amazon, Cognito ฯลฯ) — ไม่ต้องมี AWS credential</td><td>Web/mobile identity federation (ปัจจุบันแนะนำใช้ Cognito Identity Pool ครอบ); EKS IRSA ก็ใช้ API นี้</td></tr>
                <tr><td><code>GetFederationToken</code></td><td><strong>IAM user</strong> (ใช้ long-term credential) — มักเป็น custom identity broker</td><td>ออก credential ชั่วคราวให้ผู้ใช้ภายนอกที่ broker ยืนยันตัวตนแล้ว (ไม่มี IAM user ของตัวเอง)</td></tr>
                <tr><td><code>GetSessionToken</code></td><td>IAM user (หรือ root) ที่มี long-term credential</td><td>ขอ credential ชั่วคราว<strong>พร้อมยืนยัน MFA</strong> เพื่อเรียก API ที่บังคับ MFA</td></tr>
                <tr><td><code>GetCallerIdentity</code></td><td>ใครก็ได้ที่มี credential — ไม่ต้องมีสิทธิ์พิเศษ</td><td>เช็คว่า &quot;ตอนนี้ฉันคือใคร&quot; (account ID, ARN, user ID) — เหมือน whoami</td></tr>
                <tr><td><code>DecodeAuthorizationMessage</code></td><td>ผู้ที่ถูกปฏิเสธสิทธิ์ (มีข้อความ error ที่เข้ารหัส)</td><td>ถอดรหัสข้อความ authorization failure เพื่อดูสาเหตุที่ถูก deny</td></tr>
              </tbody>
            </table>
            <ul>
              <li>Credential ที่ได้เป็น <strong>ชั่วคราว</strong> ประกอบด้วย Access Key ID + Secret Access Key + <strong>Session Token</strong> และหมดอายุเอง (AssumeRole ตั้งอายุได้ตั้งแต่ 15 นาที จนถึง max session duration ของ role สูงสุด 12 ชั่วโมง; GetFederationToken / GetSessionToken ได้นานกว่า)</li>
              <li><strong>AssumeRole ต้องผ่านสองด้าน</strong>: Trust policy ของ Role ต้องอนุญาต principal นั้น และ principal ต้องมีสิทธิ์ <code>sts:AssumeRole</code> (ข้าม account ต้องอนุญาตทั้งสองฝั่ง)</li>
              <li><strong>Session policy</strong>: ใส่ policy เพิ่มตอนเรียกเพื่อ &quot;จำกัดให้แคบลง&quot; — สิทธิ์ที่ได้ = ส่วนที่ซ้อนกัน (intersection) ของสิทธิ์เดิมกับ session policy (ให้สิทธิ์เกินของเดิมไม่ได้)</li>
              <li><strong>ExternalId</strong> ใช้กับ third party ที่ assume role เข้า account เรา ป้องกัน confused deputy problem</li>
              <li>ใช้ <strong>regional STS endpoint</strong> แทน global endpoint เพื่อลด latency และเพิ่มความทนทาน</li>
              <li>Revoke session ที่ออกไปแล้ว: เพิ่ม deny policy ที่ผูกเงื่อนไขเวลาออก token (<code>aws:TokenIssueTime</code>) — เป็นสิ่งที่ปุ่ม &quot;Revoke active sessions&quot; ใน IAM console ทำให้</li>
            </ul>
            <p className="trap">กับดัก: ผู้ใช้ที่ authenticate ผ่าน SAML/OIDC แล้ว &quot;ยังไม่มี AWS credential&quot; จึงเรียก AssumeRole ไม่ได้ — ต้องใช้ AssumeRoleWithSAML / AssumeRoleWithWebIdentity | ส่วน LDAP ต่อ STS ตรงๆ ไม่ได้ ต้องมี broker ที่เรียก GetFederationToken หรือ AssumeRole แทน</p>
            <div className="tip">หลักจำ: มี credential อยู่แล้ว → AssumeRole / GetFederationToken / GetSessionToken | มาพร้อม SAML → WithSAML | มาพร้อม OIDC token → WithWebIdentity | อยากรู้ว่าเป็นใคร → GetCallerIdentity</div>
          </>
        ),
      },
      {
        title: "บังคับเข้ารหัส + Key Rotation — SSE-S3 vs SSE-KMS และบริการอื่น",
        body: (
          <>
            <p><strong>โจทย์ตัวอย่าง:</strong> ไฟล์ใน S3 บางส่วนไม่ได้เข้ารหัส AES-256 ต้องการให้ key rotate ทุกปีอัตโนมัติ และห้ามอัปโหลดไฟล์ไม่เข้ารหัสอีก โดย <em>least operational overhead</em> → ตอบ <strong>Bucket policy Deny + SSE-S3</strong></p>
            <h4>1) เลือกชนิดการเข้ารหัสของ S3</h4>
            <table>
              <tbody>
                <tr><th>ชนิด</th><th>ใครจัดการ key</th><th>Rotate</th><th>เหมาะเมื่อ</th></tr>
                <tr><td><strong>SSE-S3</strong> (<code>AES256</code>)</td><td>AWS ทั้งหมด (ไม่ผ่าน KMS ที่เราเห็น)</td><td>AWS ทำให้เอง ตั้งรอบ/ดู audit ไม่ได้</td><td>ต้องการ AES-256 + ไม่อยากดูแลอะไร (least overhead)</td></tr>
                <tr><td><strong>SSE-KMS</strong> (<code>aws:kms</code>) + AWS managed key (<code>aws/s3</code>)</td><td>AWS ผ่าน KMS</td><td>AWS rotate ให้ ปิด/เปลี่ยนรอบไม่ได้</td><td>อยากได้ log ใน CloudTrail แต่ไม่คุม key เอง</td></tr>
                <tr><td><strong>SSE-KMS</strong> + customer managed key</td><td>เรา (key policy, grant)</td><td><strong>ต้องติ๊กเปิด automatic rotation เอง</strong> (ค่าเริ่มต้นปีละครั้ง)</td><td>ต้องคุมสิทธิ์/audit key เอง, compliance เข้ม</td></tr>
                <tr><td><strong>SSE-C</strong></td><td>ลูกค้าส่ง key มากับทุก request</td><td>เรา rotate เอง (AWS ไม่เก็บ key)</td><td>ต้องถือ key เองทั้งหมด (ใช้ HTTPS เท่านั้น)</td></tr>
              </tbody>
            </table>
            <h4>2) Bucket policy บังคับเข้ารหัส (Deny ถ้าไม่มี header)</h4>
            <pre><code>{`{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::my-bucket/*",
  "Condition": {
    "StringNotEquals": {
      "s3:x-amz-server-side-encryption": "AES256"
    }
  }
}`}</code></pre>
            <p>ถ้าบังคับ KMS ให้เปลี่ยนค่าเป็น <code>aws:kms</code> | อีกวิธีที่ง่ายกว่าคือตั้ง <strong>default encryption</strong> ของ bucket (ปัจจุบัน S3 เข้ารหัส SSE-S3 ให้ object ใหม่ทุกตัวเป็นค่าเริ่มต้นแล้ว)</p>
            <h4>3) บริการอื่นทำแบบเดียวกันได้</h4>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>วิธีบังคับเข้ารหัส</th></tr>
                <tr><td>EBS</td><td>เปิด <strong>EBS encryption by default</strong> ระดับ Region หรือ Deny <code>ec2:CreateVolume</code> เมื่อ <code>ec2:Encrypted</code> เป็น false</td></tr>
                <tr><td>RDS / Aurora</td><td>ต้องเลือกตอนสร้าง (เปิดทีหลังบน DB เดิมไม่ได้) / Deny เมื่อ <code>rds:StorageEncrypted</code> เป็น false</td></tr>
                <tr><td>EFS</td><td>เลือกตอนสร้าง / Deny เมื่อ <code>elasticfilesystem:Encrypted</code> เป็น false</td></tr>
                <tr><td>DynamoDB, SQS, SNS, Secrets Manager</td><td>เข้ารหัสอยู่แล้วเสมอ ไม่ต้องบังคับ</td></tr>
                <tr><td>ทั้ง Organization</td><td>ใช้ <strong>SCP</strong> Deny ตาม condition key ข้างบน (SCP เป็น guardrail ปฏิเสธเท่านั้น ไม่ได้ให้สิทธิ์)</td></tr>
                <tr><td>แค่ตรวจจับ</td><td><strong>AWS Config</strong> managed rule เช่น <code>encrypted-volumes</code>, <code>rds-storage-encrypted</code>, <code>s3-bucket-server-side-encryption-enabled</code></td></tr>
              </tbody>
            </table>
            <h4>4) Rotation ของ key แต่ละชนิด</h4>
            <ul>
              <li><strong>AWS owned key</strong> (เช่น DynamoDB ค่าเริ่มต้น): AWS จัดการทั้งหมด</li>
              <li><strong>AWS managed key</strong> (<code>aws/s3</code>, <code>aws/ebs</code>, <code>aws/rds</code>): AWS rotate ให้อัตโนมัติ เราควบคุมไม่ได้</li>
              <li><strong>Customer managed key</strong>: เปิด automatic rotation ได้ (ไม่ต้อง rotate เอง แต่ต้องเปิดเอง)</li>
              <li><strong>Imported key material</strong>: automatic rotation ไม่ได้ ต้อง rotate เอง</li>
            </ul>
            <p className="trap">กับดัก: &quot;Manually rotate the KMS key every year&quot; = overhead สูง ผิดเมื่อโจทย์ถาม least overhead | SCP ใช้กับ bucket เดียวไม่ได้ (ระดับ Account/OU) | S3 Object Lock ไม่เกี่ยวกับการเข้ารหัสหรือ rotate key (ใช้กันลบ/แก้ object)</p>
            <div className="tip">หลักจำ: ไม่อยากดูแล key → SSE-S3 / AWS managed key | ต้องคุม/audit key เอง → SSE-KMS customer managed + เปิด automatic rotation | บังคับ → Deny policy / SCP ที่ดู condition key | ตรวจจับ → AWS Config (ตัวเลขรอบ rotate ให้เช็กกับ AWS docs ปัจจุบัน)</div>
          </>
        ),
      },
    ],
  },
  {
    id: "management",
    title: "Management & Monitoring",
    cards: [
      {
        title: "AWS CloudFormation (CFN)",
        body: (
          <>
            <p>Infrastructure as Code — เขียน template (YAML/JSON) แบบ declarative เพื่อ model/provision/version-control infra ทั้งหมดในไฟล์ text เดียว</p>
            <p>เทียบได้กับ Kubernetes <code>deployment.yaml</code> แต่ CFN คุมทั้ง AWS account ส่วน K8s YAML คุมแค่ภายใน cluster</p>
            <p className="trap">ข้อจำกัด: deploy stack ใหม่ตอนเกิด failure จริงช้ากว่า resource ที่ pre-provisioned ไว้ล่วงหน้า</p>
          </>
        ),
      },
      {
        title: "CloudWatch Logs — Compliance Auditing",
        body: (
          <>
            <p>Unified CloudWatch Logs Agent รองรับทั้ง Windows + Linux เก็บรายละเอียดระดับ system (memory, disk, process) เกินกว่า metric ระดับ hypervisor ปกติ</p>
            <p>วิเคราะห์ log ด้วย <strong>CloudWatch Logs Insights</strong> (query ภาษาคล้าย SQL)</p>
            <p className="trap">AWS Inspector = security scanning (ผิดจุดประสงค์) | SSM Agent = remote management (ผิดจุดประสงค์) | Custom SDK script = effort สูงเกินจำเป็น</p>
            <div className="tip">เครื่องมือดู log อื่นๆ: OpenSearch Service, QuickSight, และนอก AWS เช่น Datadog, Splunk, Grafana+Loki, ELK Stack</div>
          </>
        ),
      },
      {
        title: "AWS Config + EventBridge + Lambda — Compliance อัตโนมัติ (ตัวอย่าง: IAM Access Key เกิน 90 วัน)",
        body: (
          <>
            <ul>
              <li><strong>AWS Config</strong> = ผู้ตัดสินว่า resource <strong>ผ่านเงื่อนไขหรือไม่ (compliant / non-compliant)</strong> พร้อมเก็บประวัติและแดชบอร์ด compliance</li>
              <li><strong>EventBridge</strong> = ผู้ส่งต่อเหตุการณ์ — รับ event &quot;Config Rules Compliance Change&quot; แล้วกรองเฉพาะ NON_COMPLIANT (EventBridge <strong>ตรวจอายุ key เองไม่ได้</strong>)</li>
              <li><strong>Lambda</strong> = ผู้ลงมือแก้ไข (remediation) เช่น deactivate แล้วลบ access key</li>
            </ul>
            <pre>{`IAM access key (อายุเกิน 90 วัน)
  ↓ Config managed rule: access-keys-rotated (maxAccessKeyAge = 90)
NON_COMPLIANT
  ↓ event: Config Rules Compliance Change
EventBridge rule (กรอง NON_COMPLIANT)
  ↓ target
Lambda → deactivate + delete key`}</pre>
            <h4>Config rule ทำงานเมื่อไหร่</h4>
            <table>
              <tbody>
                <tr><th>Trigger</th><th>ทำงานเมื่อ</th><th>ใช้กับ</th></tr>
                <tr><td>Configuration change</td><td>resource ถูกสร้าง/แก้ไข</td><td>เงื่อนไขจากค่าตั้งของ resource (เช่น bucket ต้องเข้ารหัส)</td></tr>
                <tr><td><strong>Periodic</strong></td><td>ตามรอบเวลาที่ตั้ง (เช่น ทุก 24 ชม.)</td><td>เงื่อนไขที่ขึ้นกับ <strong>เวลา/อายุ</strong> เช่น access key age</td></tr>
              </tbody>
            </table>
            <ul>
              <li>IAM access key <strong>ไม่มีวันหมดอายุในตัวเอง</strong> — ไม่มีเหตุการณ์ &quot;ครบอายุ&quot; ใน IAM; Config ประเมินอายุเป็นรอบ จึงมีความล่าช้าได้สูงสุดเท่ากับความถี่ที่ตั้ง</li>
              <li>Event ส่งเมื่อ <strong>สถานะ compliance เปลี่ยน</strong> ไม่ใช่ทุกครั้งที่ประเมิน</li>
              <li>Config มี <strong>remediation action</strong> เรียก Systems Manager Automation ได้ (แก้โดยไม่ต้องเขียน Lambda)</li>
            </ul>
            <h4>ทำไมไม่ใช้ Batch (LEAST operational effort)</h4>
            <table>
              <tbody>
                <tr><th></th><th>Config managed rule + EventBridge + Lambda</th><th>Custom rule + Scheduler + AWS Batch</th></tr>
                <tr><td>ตรวจอายุ key</td><td>managed rule (ไม่ต้องเขียนโค้ด)</td><td>เขียน/ดูแลโค้ด custom rule เอง</td></tr>
                <tr><td>ตัวทำงานรายรอบ</td><td>Config (periodic ในตัว)</td><td>Scheduler ปลุก Batch ทุก 24 ชม.</td></tr>
                <tr><td>ตัวลบ key</td><td>Lambda เรียกเฉพาะตอนมี non-compliant</td><td>Batch job (compute environment, queue, job definition, image)</td></tr>
                <tr><td>ภาระดูแล</td><td>น้อย</td><td>มาก — Batch เหมาะกับงานประมวลผลหนัก ไม่ใช่ลบ key ไม่กี่ตัว</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: ภาระดูแลน้อยที่สุด → managed rule ก่อน custom, Lambda สำหรับงานเบา, Batch สำหรับงานหนักเป็นชุด | pattern &quot;Config → EventBridge → Lambda&quot; ใช้บ่อยกับ compliance อัตโนมัติ</div>
            <p className="trap">กับดัก: EventBridge อย่างเดียวกรองอายุ access key ไม่ได้ (ไม่มี event บอกอายุ) ต้องให้ Config ประเมินก่อน | ชื่อ managed rule และตัวเลือกความถี่ ควรตรวจกับเอกสาร Config ล่าสุด</p>
          </>
        ),
      },
    ],
  },
  {
    id: "dr",
    title: "DR & Resilience",
    cards: [
      {
        title: "Multi-region DR Architecture",
        body: (
          <ul>
            <li>DynamoDB <strong>Global Table</strong> สำหรับ replicate ข้าม region (ไม่ใช่ GSI)</li>
            <li><strong>Route 53 DNS Failover</strong> สำหรับสลับ traffic ไป secondary region</li>
            <li><strong>AWS Well-Architected Tool</strong> สำหรับ architectural review + best practices (ไม่ใช่ Compute Optimizer ที่ทำแค่ rightsizing, ไม่ใช่ Prometheus/Grafana ที่ทำแค่ metrics/dashboard)</li>
          </ul>
        ),
      },
      {
        title: "DR ข้าม Region ของแต่ละบริการ (รวมตัวอย่าง Redshift)",
        body: (
          <>
            <p>โจทย์ที่บอกว่า <strong>&quot;ทั้ง AWS region ล่ม&quot;</strong> ต้องมีข้อมูลสำรองอยู่ <strong>นอก region เดิม</strong> — snapshot/backup ปกติมักอยู่ region เดียวกับต้นทาง จึงไม่พอ</p>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>วิธี DR ข้าม region</th></tr>
                <tr><td><strong>Redshift</strong></td><td><strong>Cross-Region Snapshot Copy</strong> — คัดลอก snapshot ไป region อื่นอัตโนมัติ แล้ว restore cluster ใหม่ที่ region ปลายทางเมื่อ region หลักล่ม</td></tr>
                <tr><td><strong>RDS</strong></td><td>Cross-Region Read Replica (promote เป็น primary ได้) / คัดลอก snapshot ข้าม region / Aurora Global Database</td></tr>
                <tr><td><strong>S3</strong></td><td>Cross-Region Replication (CRR) — ต้องเปิด Versioning ทั้งสอง bucket</td></tr>
                <tr><td><strong>DynamoDB</strong></td><td>Global Tables (multi-region, multi-active)</td></tr>
                <tr><td><strong>EBS / AMI</strong></td><td>คัดลอก snapshot / AMI ข้าม region</td></tr>
                <tr><td><strong>DNS สลับ region</strong></td><td>Route 53 failover routing + health check</td></tr>
              </tbody>
            </table>
            <p><strong>ตัวอย่างโจทย์ Redshift:</strong> data warehouse ใช้ Redshift cluster ต้องมี DR รอดแม้ region ล่ม → <strong>เปิด Cross-Region Snapshot Copy</strong></p>
            <ul>
              <li><strong>&quot;Do nothing เพราะ Redshift highly available&quot;</strong> ผิด — cluster ตั้งอยู่ใน region เดียว (โดยทั่วไปอยู่ AZ เดียว) ทั้ง region ล่มก็ใช้ไม่ได้</li>
              <li><strong>Automated snapshots</strong> ผิด — อยู่ region เดียวกับ cluster ถ้า region ล่มก็เข้าไม่ถึง ต้องเปิดคัดลอกข้าม region</li>
              <li><strong>Scheduled job เก็บ snapshot ลง S3</strong> ผิด — ต้องสร้าง/ดูแลเองและไม่ระบุว่าข้าม region</li>
            </ul>
            <div className="tip">หลักจำ: region ล่ม → ต้องมีข้อมูลนอก region | Redshift = Cross-Region Snapshot Copy | RDS = Cross-Region Read Replica / snapshot copy | S3 = CRR | DynamoDB = Global Tables</div>
            <p className="trap">กับดัก: Multi-AZ แก้ปัญหา AZ ล่ม ไม่ใช่ region ล่ม | Snapshot ปกติ (automated/manual) อยู่ region เดิมจนกว่าจะตั้งคัดลอกข้าม region</p>
          </>
        ),
      },
    ],
  },
  {
    id: "high-availability",
    title: "High Availability & Fault Tolerance",
    cards: [
      {
        title: "High Availability vs Fault Tolerance",
        body: (
          <>
            <table>
              <tbody>
                <tr><th></th><th>High Availability (HA)</th><th>Fault Tolerance (FT)</th></tr>
                <tr><td>เป้าหมาย</td><td>ระบบกลับมาใช้งานได้ <strong>เร็ว</strong> เมื่อมีส่วนที่ล้ม</td><td>ระบบทำงานต่อ <strong>ไม่สะดุดเลย</strong> แม้มีส่วนที่ล้ม</td></tr>
                <tr><td>Downtime</td><td>อาจมีช่วง failover สั้นๆ</td><td>เป้าหมายคือ zero downtime</td></tr>
                <tr><td>ต้นทุน</td><td>ต่ำกว่า</td><td>สูงกว่า (ต้องมี capacity สำรองพร้อมรับโหลดเต็มตลอดเวลา)</td></tr>
                <tr><td>ตัวอย่าง</td><td>RDS Multi-AZ (standby สลับขึ้นมาใน ~1-2 นาที)</td><td>EC2 กระจายหลาย AZ โดยเหลือพอรับโหลดแม้เสียไป 1 AZ</td></tr>
              </tbody>
            </table>
            <p>สูตรเช็ค FT ข้าม AZ: จำนวนรวมทุก AZ − จำนวนใน AZ ที่มากที่สุด ต้องยังไม่น้อยกว่าจำนวนที่โจทย์บังคับ (เช่น (3,3,3) ต้องการ 6 ผ่าน, (2,2,2) ไม่ผ่าน)</p>
            <div className="tip">หลักจำ: โจทย์เน้น &quot;ไม่มี downtime เลย / ทนต่อความล้มเหลวของ AZ&quot; → Fault Tolerance (ต้องมีสำรองเกินพอ) | เน้น &quot;กลับมาใช้งานได้อัตโนมัติ&quot; → High Availability</div>
          </>
        ),
      },
      {
        title: "ออกแบบ Multi-AZ: ELB + Auto Scaling",
        body: (
          <>
            <ul>
              <li>วาง <strong>ELB</strong> หน้า EC2 และให้ <strong>Auto Scaling Group ครอบหลาย AZ</strong> — ถ้า AZ หนึ่งล้ม ELB ส่งทราฟฟิกไป AZ ที่ยังปกติ ASG สร้าง instance ทดแทน</li>
              <li><strong>Health check</strong>: ค่าเริ่มต้น ASG ดูแค่ EC2 status check — ถ้าต้องการให้เปลี่ยน instance ที่ <strong>แอปไม่ตอบสนอง</strong> ต้องเปิด <strong>ELB health check</strong> บน ASG</li>
              <li><strong>Cross-zone load balancing</strong>: ALB เปิดเป็นค่าเริ่มต้น (ไม่คิดค่า inter-AZ), NLB ปิดเป็นค่าเริ่มต้น (เปิดแล้วมีค่า data transfer ข้าม AZ)</li>
              <li>ทำแอปแบบ <strong>stateless</strong> — เก็บ session ใน ElastiCache หรือ DynamoDB ไม่เก็บบน instance เพื่อให้เครื่องไหนล้มก็ไม่กระทบผู้ใช้</li>
              <li><strong>Decouple</strong> ด้วย SQS/SNS — ถ้าฝั่งประมวลผลล้ม ข้อความยังรออยู่ในคิว ไม่หาย</li>
            </ul>
            <p className="trap">กับดัก: EBS ผูกกับ AZ เดียว — ถ้าจะให้ข้อมูลรอด AZ ล่มต้อง snapshot/replicate หรือใช้บริการข้าม AZ อย่าง EFS (Regional), S3, RDS Multi-AZ</p>
          </>
        ),
      },
      {
        title: "ลำดับการ Terminate EC2 ตอน Auto Scaling Scale-in (Termination Policy)",
        body: (
          <>
            <p>เมื่อ ASG ต้องลดจำนวน instance (scale-in) จะเลือกเครื่องที่ต้อง terminate ตาม <strong>Termination Policy</strong> — ค่าเริ่มต้นคือ <strong>Default</strong></p>
            <h4>Default termination policy — ลำดับการตัดสินใจ</h4>
            <table>
              <tbody>
                <tr><th>ขั้น</th><th>เกณฑ์</th></tr>
                <tr><td>0</td><td>ข้าม instance ที่เปิด <strong>Scale-in protection</strong> (ไม่ถูกเลือก)</td></tr>
                <tr><td>1</td><td>เลือก <strong>AZ ที่มี instance มากที่สุด</strong> (เพื่อรักษาสมดุลระหว่าง AZ)</td></tr>
                <tr><td>2</td><td>ใน AZ นั้น เลือก instance ที่ใช้ <strong>Launch Template / Launch Configuration เก่าสุด</strong></td></tr>
                <tr><td>3</td><td>ถ้ายังเท่ากัน เลือกตัวที่ <strong>ใกล้รอบ billing ชั่วโมงถัดไปที่สุด</strong></td></tr>
                <tr><td>4</td><td>ถ้ายังเท่ากันอีก → <strong>สุ่ม</strong></td></tr>
              </tbody>
            </table>
            <p>กรณี Mixed Instances (On-Demand + Spot) จะพิจารณา allocation strategy ก่อนขั้น 2 เพื่อให้สัดส่วนที่เหลือตรงกับที่ตั้งไว้</p>
            <h4>Termination policy อื่นๆ ที่เลือกได้</h4>
            <ul>
              <li><strong>OldestInstance</strong> — terminate เครื่องที่ launch นานที่สุด (ใช้เมื่ออยากทยอยเปลี่ยนเครื่องเก่า/เปลี่ยน instance type)</li>
              <li><strong>NewestInstance</strong> — terminate เครื่องที่ใหม่สุด (ใช้ทดสอบ config ใหม่แล้วถอยกลับ)</li>
              <li><strong>OldestLaunchConfiguration / OldestLaunchTemplate</strong> — เครื่องที่ใช้ config/template เก่าสุดก่อน</li>
              <li><strong>ClosestToNextInstanceHour</strong> — ใกล้รอบ billing ถัดไปสุด (ประหยัดค่าใช้จ่ายสมัยคิดรายชั่วโมง)</li>
              <li><strong>AllocationStrategy</strong> — ให้สัดส่วน On-Demand/Spot ตรงกับ allocation strategy</li>
            </ul>
            <h4>สิ่งที่ควบคุมการ terminate ได้</h4>
            <ul>
              <li><strong>Scale-in protection</strong> — กันไม่ให้ ASG เลือก instance นี้ตอน scale-in (ระดับ instance หรือทั้ง ASG)</li>
              <li><strong>Lifecycle hook (Terminating:Wait)</strong> — หยุดรอก่อน terminate เพื่อดึง log / ทำ cleanup แล้วค่อยปล่อยต่อ</li>
              <li><strong>Termination protection (DisableApiTermination)</strong> — กัน terminate ผ่าน API/Console แต่ <strong>ไม่กัน ASG scale-in</strong> (ต้องใช้ Scale-in protection)</li>
              <li><strong>Delete on Termination</strong> — EBS root ถูกลบตามค่าเริ่มต้น, volume เพิ่มเติมไม่ลบ</li>
              <li><strong>Instance-initiated shutdown behavior</strong> — สั่ง shutdown จากใน OS แล้วให้ stop หรือ terminate</li>
            </ul>
            <div className="tip">หลักจำ: Default = สมดุล AZ ก่อน (AZ ที่มีเครื่องเยอะสุด) → config เก่าสุด → ใกล้รอบ billing → สุ่ม | อยากกันเครื่องไม่ให้ถูกลดตอน scale-in → Scale-in protection | อยากเก็บ log ก่อนตาย → Lifecycle hook</div>
            <p className="trap">กับดัก: Default ไม่ได้เลือก &quot;เครื่องเก่าสุด&quot; เป็นอันดับแรก แต่ดู <strong>AZ ที่มีเครื่องมากที่สุดก่อน</strong> | Termination protection ของ EC2 ไม่ได้กัน Auto Scaling | ถ้าต้องการให้เครื่องเก่าสุดถูกลบก่อนแน่ๆ ให้ตั้ง OldestInstance</p>
          </>
        ),
      },
      {
        title: "Database HA: RDS Multi-AZ vs Read Replica vs Aurora",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>แบบ</th><th>วัตถุประสงค์</th><th>จุดสำคัญ</th></tr>
                <tr><td><strong>RDS Multi-AZ</strong> (instance deployment)</td><td>High Availability / failover</td><td>Standby ต่าง AZ แบบ <strong>synchronous</strong>, failover อัตโนมัติ, standby <strong>อ่านไม่ได้</strong> (ไม่ได้ช่วย scale read)</td></tr>
                <tr><td><strong>Read Replica</strong></td><td>Scale การอ่าน (performance)</td><td>Replicate แบบ <strong>asynchronous</strong>, อ่านได้, ข้าม region ได้, promote เป็น DB อิสระได้</td></tr>
                <tr><td><strong>Aurora</strong></td><td>HA + performance</td><td>เก็บข้อมูล <strong>6 copies ข้าม 3 AZ</strong>, มี replica ได้สูงสุด 15 ตัว (ใช้เป็น failover target ด้วย)</td></tr>
                <tr><td><strong>Aurora Global Database</strong></td><td>DR ข้าม region</td><td>Replicate ข้าม region ด้วย lag ต่ำ (RPO ระดับวินาที), promote region รองได้เร็ว</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: Multi-AZ ≠ Read Replica — Multi-AZ คือ &quot;สำรองไว้ตอนล่ม&quot; ไม่ได้ช่วยให้อ่านเร็วขึ้น | Read Replica คือ &quot;เพิ่มกำลังอ่าน&quot; ไม่ได้รับประกัน failover อัตโนมัติ</p>
          </>
        ),
      },
      {
        title: "Route 53 Health Check & Routing Policy สำหรับ Failover",
        body: (
          <>
            <ul>
              <li><strong>Failover routing</strong> (active-passive): Route 53 เช็ค health ของ primary — ถ้าไม่ healthy สลับไป secondary อัตโนมัติ</li>
              <li><strong>Weighted / Latency / Geolocation</strong> + health check: ใช้แบบ active-active ได้ — endpoint ที่ไม่ healthy จะถูกตัดออกจากคำตอบ DNS</li>
              <li>Health check ใช้เช็ค endpoint, เช็ค health ของ health check อื่น (calculated), หรือผูกกับ CloudWatch alarm ได้</li>
            </ul>
            <div className="tip">หลักจำ: สลับไป region สำรองเมื่อ primary ล่ม → Route 53 Failover + Health Check</div>
          </>
        ),
      },
      {
        title: "DR Strategies และ RTO / RPO",
        body: (
          <>
            <ul>
              <li><strong>RTO</strong> (Recovery Time Objective) = ยอมให้ระบบล่มได้นานแค่ไหน | <strong>RPO</strong> (Recovery Point Objective) = ยอมให้ข้อมูลหายย้อนหลังได้นานแค่ไหน</li>
            </ul>
            <table>
              <tbody>
                <tr><th>กลยุทธ์</th><th>ลักษณะ</th><th>RTO / RPO</th><th>ต้นทุน</th></tr>
                <tr><td>Backup &amp; Restore</td><td>สำรองข้อมูลไว้ แล้วค่อยสร้างระบบใหม่ตอนเกิดเหตุ</td><td>ชั่วโมง</td><td>ต่ำสุด</td></tr>
                <tr><td>Pilot Light</td><td>เปิดเฉพาะส่วนแกนหลัก (เช่น DB replicate) ส่วนอื่นพร้อมสร้างทีหลัง</td><td>สิบนาที - ชั่วโมง</td><td>ต่ำ</td></tr>
                <tr><td>Warm Standby</td><td>รันระบบเต็มรูปแบบในขนาดย่อ พร้อมขยายเมื่อเกิดเหตุ</td><td>นาที</td><td>ปานกลาง</td></tr>
                <tr><td>Multi-Site Active/Active</td><td>รันเต็มกำลังหลาย region พร้อมกัน</td><td>แทบเป็นศูนย์ - วินาที</td><td>สูงสุด</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: CloudFormation สร้าง stack ใหม่ตอนเกิดเหตุจริงช้ากว่า resource ที่เตรียมไว้ — ถ้าโจทย์ต้องการ RTO ต่ำมาก ต้องเป็น Warm Standby หรือ Active/Active</p>
          </>
        ),
      },
    ],
  },
  {
    id: "high-performance",
    title: "High Performance",
    cards: [
      {
        title: "Caching — ลดโหลด ลด latency",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>แคชอะไร / ใช้เมื่อ</th></tr>
                <tr><td><strong>CloudFront</strong></td><td>CDN แคชเนื้อหา (static และ dynamic ผ่าน HTTP) ที่ edge location ใกล้ผู้ใช้ทั่วโลก</td></tr>
                <tr><td><strong>ElastiCache</strong></td><td>In-memory cache หน้า database / เก็บ session — เลือก <strong>Redis</strong> (persistence, replication, Multi-AZ failover, data structure หลากหลาย) หรือ <strong>Memcached</strong> (เรียบง่าย multi-thread ไม่มี persistence)</td></tr>
                <tr><td><strong>DAX</strong></td><td>แคชเฉพาะ <strong>DynamoDB</strong> — อ่านระดับไมโครวินาที ใช้ API เข้ากันได้กับ DynamoDB แก้โค้ดน้อยมาก</td></tr>
                <tr><td><strong>API Gateway Cache</strong></td><td>แคชคำตอบของ API ที่ stage ลดการเรียก backend</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: DynamoDB อ่านช้า/ต้องไมโครวินาที → DAX | แคชหน้า RDS/ทั่วไป → ElastiCache | เนื้อหาเว็บผู้ใช้ทั่วโลก → CloudFront</div>
          </>
        ),
      },
      {
        title: "EBS Provisioned IOPS — อัตราส่วน IOPS ต่อ GiB & Queue Length",
        body: (
          <>
            <p>สูตรที่ใช้ตอบโจทย์: <strong>IOPS สูงสุดที่ตั้งได้ = ขนาด volume (GiB) × อัตราส่วนสูงสุดของ type นั้น</strong></p>
            <table>
              <tbody>
                <tr><th>Volume type</th><th>อัตราส่วนสูงสุด</th><th>หมายเหตุ</th></tr>
                <tr><td><strong>io1</strong></td><td><strong>50 IOPS ต่อ GiB</strong></td><td>เช่น 10 GiB → สูงสุด <strong>500 IOPS</strong> | 100 GiB → 5,000 IOPS</td></tr>
                <tr><td>io2</td><td>500 IOPS ต่อ GiB</td><td>ทนทานกว่า (99.999%) และอัตราส่วนสูงกว่า io1 มาก; io2 Block Express สูงกว่านี้อีก</td></tr>
                <tr><td>gp2</td><td>3 IOPS ต่อ GiB (baseline)</td><td>ผูกกับขนาดโดยตรง ขนาดเล็กได้ IOPS น้อย (มี burst)</td></tr>
                <tr><td>gp3</td><td>baseline 3,000 IOPS</td><td>ตั้ง IOPS แยกจากขนาดได้ (ภายในเพดานอัตราส่วนของ gp3)</td></tr>
              </tbody>
            </table>
            <ul>
              <li>ขนาดเล็กแต่อยากได้ IOPS สูง → ต้องเพิ่มขนาด volume ให้พอกับอัตราส่วน หรือเปลี่ยนไป type ที่อัตราส่วนสูงกว่า (io2)</li>
              <li><strong>Queue length</strong> = จำนวน I/O request ที่รอรอบอยู่ — คิวยาว = ใช้ IOPS ได้เต็มแต่ <strong>latency เพิ่ม</strong>; คิวสั้น = latency ต่ำ</li>
              <li>งาน transaction-intensive ที่ต้อง <strong>latency ต่ำ</strong> → ตั้ง IOPS ให้เต็มเพดานของ volume และ <strong>รักษา queue length ให้ต่ำ</strong></li>
            </ul>
            <div className="tip">ตัวอย่างข้อสอบ: io1 ขนาด 10 GiB ต้องการ IOPS สูงและ latency ต่ำ → ตั้ง <strong>500 IOPS</strong> + <strong>low queue length</strong> (800/600 เกินเพดาน 50:1 ตั้งไม่ได้)</div>
            <p className="trap">กับดัก: ตัวเลือกที่ IOPS เกิน (ขนาด × อัตราส่วน) ตัดทิ้งก่อนเลย | ตัวเลือก &quot;high queue length&quot; ขัดกับโจทย์ที่ต้องการ latency ต่ำ | ตัวเลือกที่ IOPS ต่ำกว่าเพดานแต่ตั้งได้ ไม่ใช่ &quot;high IOPS&quot; เต็มที่</p>
          </>
        ),
      },
      {
        title: "IOPS vs Throughput vs Latency — ต่างกันอย่างไร ใช้เมื่อไหร่",
        body: (
          <>
            <ul>
              <li><strong>IOPS</strong> = จำนวนครั้งที่อ่าน/เขียนได้ต่อวินาที (นับ &quot;จำนวนคำขอ&quot;)</li>
              <li><strong>Throughput</strong> = ปริมาณข้อมูลที่ส่งผ่านต่อวินาที (MB/s)</li>
              <li><strong>Latency</strong> = เวลาที่ใช้ต่อคำขอหนึ่งครั้ง (ยิ่งต่ำยิ่งดี)</li>
              <li>ความสัมพันธ์โดยประมาณ: <strong>Throughput ≈ IOPS × ขนาด I/O ต่อครั้ง</strong> (เช่น 1,000 IOPS × 4 KB ≈ 4 MB/s)</li>
            </ul>
            <table>
              <tbody>
                <tr><th></th><th>เน้น IOPS</th><th>เน้น Throughput</th></tr>
                <tr><td>ลักษณะ I/O</td><td>ก้อนเล็ก สุ่มตำแหน่ง ถี่ๆ</td><td>ก้อนใหญ่ ต่อเนื่อง (sequential)</td></tr>
                <tr><td>ตัวอย่างงาน</td><td>database transaction (OLTP), ไฟล์เล็กจำนวนมาก</td><td>big data, log processing, data warehouse, streaming</td></tr>
                <tr><td>EBS ที่เหมาะ</td><td>io1 / io2 (หรือ gp3 ตั้ง IOPS เพิ่ม)</td><td>st1 (ใช้บ่อย) / sc1 (เข้าถึงไม่บ่อย ถูกสุด)</td></tr>
              </tbody>
            </table>
            <h4>IOPS สูงมีประโยชน์เมื่อไหร่ (ทั้งที่ข้อมูลต่อครั้งน้อย)</h4>
            <ul>
              <li>งานที่มี <strong>คำขอเล็กๆ จำนวนมากพร้อมกัน</strong> — คอขวดคือ &quot;จำนวนคำขอที่ disk รับไหว&quot; ไม่ใช่ขนาดท่อข้อมูล</li>
              <li>IOPS ไม่พอ → คำขอ <strong>ต่อคิว</strong> → latency พุ่ง → แอปช้า แม้ throughput ยังเหลือ</li>
              <li>ตัวอย่าง: 10,000 transaction/วินาที × 4 KB ≈ ต้อง ~10,000 IOPS แต่ throughput แค่ ~40 MB/s</li>
              <li>ใช้ disk ที่ throughput สูงแต่ IOPS ต่ำ (st1) กับงานนี้ → ช้า เพราะรับคำขอไม่ทัน</li>
              <li>กลับกัน: อ่านไฟล์ log ใหญ่ต่อเนื่อง ต้องการ throughput ไม่ต้องการ IOPS สูง → จ่าย io1/io2 ไปก็ไม่คุ้ม</li>
            </ul>
            <div className="tip">หลักจำ: transaction / random / latency ต่ำ → IOPS → io1/io2 | big data / sequential / streaming → Throughput → st1 | ถูกและใช้ทั่วไป → gp3 | เก็บนานเข้าถึงไม่บ่อยถูกสุด → sc1</div>
            <p className="trap">กับดัก: ข้อสอบชอบใส่ io1/io2 เป็นตัวหลอกในโจทย์ที่เป็นงาน sequential/throughput | โจทย์ที่ขอ &quot;IOPS สูง&quot; แต่เสนอ st1/sc1 (HDD) ก็ผิดเช่นกัน | IOPS และ Throughput เป็นเพดานคนละตัว ชนตัวไหนก่อนก็ช้าที่ตัวนั้น</p>
          </>
        ),
      },
      {
        title: "Scale Database ให้เร็ว",
        body: (
          <ul>
            <li><strong>Read Replica</strong> — กระจายภาระอ่านออกจาก primary (RDS และ Aurora)</li>
            <li><strong>Aurora</strong> — ประสิทธิภาพสูงกว่า RDS ทั่วไป replica ได้สูงสุด 15 ตัว มี reader endpoint กระจายภาระอ่านอัตโนมัติ</li>
            <li><strong>RDS Proxy</strong> — pool connection ลดภาระ DB เมื่อมี Lambda/แอปเปิด connection จำนวนมาก</li>
            <li><strong>DynamoDB</strong> — ออกแบบ partition key ให้กระจายตัว (หลีกเลี่ยง hot partition); เลือก on-demand เมื่อโหลดคาดเดายาก, provisioned + auto scaling เมื่อคาดการณ์ได้</li>
          </ul>
        ),
      },
      {
        title: "Network Performance: CloudFront vs Global Accelerator",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>CloudFront</th><th>Global Accelerator</th></tr>
                <tr><td>CDN <strong>แคช</strong>เนื้อหา HTTP/HTTPS ที่ edge</td><td><strong>ไม่แคช</strong> — ส่งทราฟฟิก TCP/UDP เข้า AWS backbone ที่ edge ใกล้ผู้ใช้ ไปยัง endpoint ที่ healthy</td></tr>
                <tr><td>เหมาะกับเว็บ/สื่อ/API ที่แคชได้</td><td>ให้ <strong>static anycast IP 2 ตัว</strong>, failover เร็ว, เหมาะกับเกม/IoT/VoIP หรือแอปที่ไม่แคชได้</td></tr>
              </tbody>
            </table>
            <p><strong>S3 Transfer Acceleration</strong> ใช้เฉพาะอัปโหลดเข้า S3 ผ่าน edge — คนละงานกับสองตัวข้างบน</p>
            <div className="tip">หลักจำ: แคชเนื้อหา → CloudFront | ต้องการ static IP + เร่ง TCP/UDP + failover → Global Accelerator</div>
          </>
        ),
      },
      {
        title: "EC2 Performance: Placement Group และชนิด Instance",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>Placement Group</th><th>ลักษณะ</th><th>ใช้เมื่อ</th></tr>
                <tr><td><strong>Cluster</strong></td><td>รวมใน AZ เดียว ใกล้กันมาก</td><td>HPC / ต้องการ latency ต่ำ throughput สูงระหว่างโหนด (แลกกับความเสี่ยงถ้า AZ/ฮาร์ดแวร์มีปัญหา)</td></tr>
                <tr><td><strong>Spread</strong></td><td>แยกฮาร์ดแวร์ละ instance</td><td>instance สำคัญไม่กี่ตัวที่ห้ามล้มพร้อมกัน</td></tr>
                <tr><td><strong>Partition</strong></td><td>แบ่งเป็น partition แยกฮาร์ดแวร์</td><td>ระบบกระจายขนาดใหญ่ เช่น Hadoop, Cassandra, Kafka</td></tr>
              </tbody>
            </table>
            <ul>
              <li>เลือก <strong>instance family</strong> ให้ตรงงาน: Compute optimized (C), Memory optimized (R/X) สำหรับ in-memory DB, Storage optimized (I/D), GPU (P/G) สำหรับ ML</li>
              <li><strong>Enhanced Networking (ENA)</strong> และ <strong>EFA</strong> (สำหรับ HPC/ML ที่ต้อง inter-node communication ประสิทธิภาพสูง)</li>
              <li><strong>Graviton</strong> (ARM) ให้ price/performance ดีกว่าในงานจำนวนมาก</li>
            </ul>
            <p className="trap">กับดัก: Cluster placement group = เร็วแต่ไม่ทน AZ ล่ม | Spread = ทนฮาร์ดแวร์ล้มแต่ไม่ได้ลด latency</p>
          </>
        ),
      },
      {
        title: "Storage, Lambda และ Decoupling เพื่อ Performance",
        body: (
          <ul>
            <li><strong>S3</strong>: รองรับประมาณ 3,500 PUT และ 5,500 GET ต่อวินาที <strong>ต่อ prefix</strong> — กระจายข้อมูลหลาย prefix เพื่อได้ throughput รวมสูงขึ้น; ใช้ Multipart Upload และ byte-range fetch สำหรับไฟล์ใหญ่</li>
            <li><strong>EBS</strong>: งาน IOPS สูง/ต่อเนื่องใช้ io2 (หรือ gp3 ที่ตั้ง IOPS เพิ่ม); throughput สูงแบบ sequential ใช้ st1; <strong>Instance Store</strong> เร็วที่สุดแต่ข้อมูลชั่วคราว</li>
            <li><strong>Lambda</strong>: ลด cold start ด้วย <strong>Provisioned Concurrency</strong> (Reserved Concurrency แค่จองเพดานการรันพร้อมกัน ไม่ได้อุ่นเครื่อง)</li>
            <li><strong>Decouple</strong>: SQS ดูดซับโหลดกระชากให้ worker ประมวลผลตามกำลัง; <strong>Kinesis Data Streams</strong> รับข้อมูล real-time ปริมาณสูง</li>
            <li><strong>Auto Scaling</strong>: Target tracking (ง่ายสุด), Step, Scheduled (รู้เวลาล่วงหน้า), Predictive (ทำนายจากประวัติ)</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Cost Management",
    cards: [
      {
        title: "อะไรคิดเงิน อะไรฟรี (กับดักที่ออกสอบบ่อย)",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>รายการ</th><th>คิดเงิน?</th><th>หมายเหตุ</th></tr>
                <tr><td>EC2 instance ที่ <strong>running</strong></td><td>✅ คิด</td><td>จ่ายค่า compute ตามเวลาที่รัน</td></tr>
                <tr><td>EC2 instance ที่ <strong>stopped</strong></td><td>❌ ไม่คิดค่า compute</td><td>แต่ <strong>EBS volume ที่ผูกอยู่ยังคิด</strong> (ตามขนาดที่จอง) และ Elastic IP ที่ไม่ได้ใช้ก็คิด</td></tr>
                <tr><td>EBS volume (แม้ instance stop)</td><td>✅ คิด</td><td>หยุดจ่ายได้เมื่อลบ volume (หรือ terminate พร้อม Delete on Termination)</td></tr>
                <tr><td><strong>VPC</strong>, subnet, route table, security group, Internet Gateway</td><td>❌ ฟรี</td><td>แต่ <strong>NAT Gateway</strong>, VPN connection, Public IPv4 address คิดเงิน</td></tr>
                <tr><td>Public Data Sets</td><td>❌ ฟรี</td><td>จ่ายเฉพาะ resource ที่เราเอาไปประมวลผล</td></tr>
                <tr><td>IAM, Organizations, Auto Scaling, CloudFormation</td><td>❌ ฟรีตัวบริการ</td><td>จ่ายเฉพาะ resource ที่ถูกสร้างขึ้น (เช่น EC2, NAT Gateway)</td></tr>
                <tr><td>Data transfer <strong>เข้า</strong> AWS จากอินเทอร์เน็ต</td><td>❌ ฟรี</td><td>Data transfer <strong>ออก</strong>อินเทอร์เน็ต ข้าม region และข้าม AZ คิดเงิน (ภายใน AZ เดียวผ่าน private IP ฟรี)</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: &quot;Stop แล้วหยุดจ่ายทั้งหมด&quot; ไม่จริง — ต้องดู storage ที่ค้างอยู่ด้วย และ VPC ฟรีแต่ของที่เสียบเพิ่ม (NAT Gateway, VPN) คิดเงิน</p>
          </>
        ),
      },
      {
        title: "EC2 Pricing Models",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>แบบ</th><th>ลักษณะ</th><th>เหมาะกับ</th></tr>
                <tr><td><strong>On-Demand</strong></td><td>จ่ายตามที่ใช้ ไม่มีข้อผูกมัด แพงสุดต่อหน่วย</td><td>งานชั่วคราว ไม่แน่นอน ทดลอง</td></tr>
                <tr><td><strong>Reserved Instances</strong></td><td>ผูกมัด 1 หรือ 3 ปี ลดได้มาก (Standard ลดสูงสุด, Convertible เปลี่ยน instance family ได้)</td><td>งานเสถียร ใช้ต่อเนื่อง คาดการณ์ได้</td></tr>
                <tr><td><strong>Savings Plans</strong></td><td>ผูกมัดการใช้จ่ายเป็น $/ชั่วโมง 1 หรือ 3 ปี — Compute Savings Plans ยืดหยุ่นข้าม instance family/region และครอบคลุม Fargate/Lambda</td><td>ต้องการส่วนลดแบบ RI แต่ยืดหยุ่นกว่า</td></tr>
                <tr><td><strong>Spot Instances</strong></td><td>ใช้ capacity ว่างของ AWS ลดสูงสุด ~90% แต่ AWS <strong>ดึงคืนได้</strong> (แจ้งก่อน 2 นาที)</td><td>งาน fault-tolerant / stateless / batch / big data ที่หยุดแล้วทำต่อได้</td></tr>
                <tr><td><strong>Dedicated Hosts</strong></td><td>เช่าเซิร์ฟเวอร์ทั้งเครื่อง เห็น socket/core — ใช้ license แบบ per-socket/per-core (BYOL)</td><td>compliance, license ผูกฮาร์ดแวร์</td></tr>
                <tr><td><strong>Dedicated Instances</strong></td><td>instance รันบนฮาร์ดแวร์ที่ไม่แชร์กับ account อื่น แต่ไม่ควบคุมการวางบนเครื่องเอง</td><td>ต้องแยกฮาร์ดแวร์แต่ไม่ต้องคุมระดับ host</td></tr>
                <tr><td><strong>Capacity Reservations</strong></td><td>จอง capacity ใน AZ ที่ต้องการ (ไม่มีส่วนลดในตัวเอง — ต้องคู่กับ RI/Savings Plans)</td><td>ต้องการการันตีว่ามีเครื่องให้ใช้</td></tr>
              </tbody>
            </table>
            <div className="tip">หลักจำ: ใช้ต่อเนื่องคาดการณ์ได้ → RI/Savings Plans | ล่มได้ ถูกที่สุด → Spot | license per-socket/core → Dedicated Host | การันตี capacity → Capacity Reservation</div>
          </>
        ),
      },
      {
        title: "เครื่องมือดู/คุม/ประเมินค่าใช้จ่าย",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>เครื่องมือ</th><th>ใช้ทำอะไร</th></tr>
                <tr><td><strong>AWS Pricing Calculator</strong></td><td><strong>ประเมินราคาล่วงหน้า</strong> ก่อน deploy จริง (ประมาณค่าใช้จ่ายสถาปัตยกรรมที่จะสร้าง)</td></tr>
                <tr><td><strong>Cost Explorer</strong></td><td>ดู/วิเคราะห์ค่าใช้จ่ายและการใช้งาน<strong>ย้อนหลัง</strong> กรอง/จัดกลุ่มตาม service, tag, account; คาดการณ์; แนะนำ RI/Savings Plans</td></tr>
                <tr><td><strong>AWS Budgets</strong></td><td>ตั้ง<strong>งบประมาณและแจ้งเตือน</strong>เมื่อใช้เกิน/คาดว่าจะเกิน (cost, usage, RI/Savings Plans coverage) และสั่ง action อัตโนมัติได้</td></tr>
                <tr><td><strong>Cost and Usage Report (CUR)</strong></td><td>รายงาน<strong>ละเอียดที่สุด</strong> ส่งเข้า S3 ไว้ query ต่อด้วย Athena/QuickSight</td></tr>
                <tr><td><strong>Cost Allocation Tags</strong></td><td>ติดแท็ก resource เพื่อแยกค่าใช้จ่ายตามทีม/โปรเจกต์ — ต้อง <strong>activate</strong> ใน Billing console ก่อนถึงจะขึ้นในรายงาน</td></tr>
                <tr><td><strong>Cost Anomaly Detection</strong></td><td>ใช้ ML ตรวจค่าใช้จ่ายผิดปกติและแจ้งเตือน</td></tr>
                <tr><td><strong>Compute Optimizer</strong></td><td>แนะนำ rightsizing (EC2, EBS, Lambda ฯลฯ) จากข้อมูลการใช้งานจริง</td></tr>
                <tr><td><strong>Trusted Advisor</strong></td><td>ตรวจ best practice หลายหมวด เช่น cost optimization, performance, security, fault tolerance, service limits (เช็คครบทุกข้อต้องมี support plan ระดับ Business ขึ้นไป)</td></tr>
              </tbody>
            </table>
            <p className="trap">กับดัก: ประเมินราคา &quot;ก่อนสร้าง&quot; → Pricing Calculator | ดูค่าใช้จ่าย &quot;ที่เกิดขึ้นแล้ว&quot; → Cost Explorer | &quot;แจ้งเตือนเมื่อเกินงบ&quot; → Budgets | ข้อมูลดิบละเอียดสุด → CUR</p>
          </>
        ),
      },
      {
        title: "AWS Organizations — Consolidated Billing",
        body: (
          <ul>
            <li>รวมบิลของทุก member account ให้จ่าย<strong>ใบเดียวที่ management account</strong> (ใช้ฟรี)</li>
            <li><strong>รวมปริมาณการใช้งาน</strong>ข้าม account เพื่อได้ volume discount ตามขั้นราคา (เช่น S3, data transfer)</li>
            <li>ส่วนลดจาก <strong>Reserved Instances / Savings Plans</strong> แชร์ข้าม account ใน organization ได้ (ปิดการแชร์ได้)</li>
            <li>ดูค่าใช้จ่ายแยกราย account ได้ — เหมาะแยก dev/test/prod หรือแยกตามทีมโดยยังจ่ายรวมจุดเดียว</li>
            <li>ตั้ง <strong>SCP</strong> คุมสิทธิ์ และใช้ Budgets/Cost Explorer ระดับ organization ได้</li>
          </ul>
        ),
      },
      {
        title: "AWS Support Plans (ที่ใช้ในข้อสอบ + ที่ AWS กำลังปรับ)",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>แผน</th><th>จุดสำคัญ</th></tr>
                <tr><td><strong>Basic</strong> (ฟรี)</td><td>Customer service 24/7 เฉพาะเรื่อง account/billing, เอกสาร/whitepaper, Trusted Advisor เฉพาะ core checks, Health Dashboard</td></tr>
                <tr><td><strong>Developer</strong></td><td>ช่วงเวลาทำการ ติดต่อทางอีเมล, สำหรับทดลอง/non-production</td></tr>
                <tr><td><strong>Business</strong></td><td><strong>24/7</strong> ทางโทรศัพท์/แชท/อีเมล, Trusted Advisor <strong>ครบทุก check</strong>, สำหรับ production workload</td></tr>
                <tr><td><strong>Enterprise On-Ramp</strong></td><td>มีทีม TAM แบบ pool, ตอบเร็วขึ้นสำหรับระบบ business-critical</td></tr>
                <tr><td><strong>Enterprise</strong></td><td><strong>Technical Account Manager (TAM) เฉพาะ</strong>, ตอบเร็วที่สุดสำหรับ business-critical, architecture review เชิงรุก</td></tr>
              </tbody>
            </table>
            <p><strong>ข้อมูลเพิ่มเติม:</strong> มีรายงานจากแหล่งบุคคลที่สามว่า AWS กำลังปรับโครงสร้างแผน — Developer และ Business ถูกแทนที่ด้วย <strong>Business Support+</strong> และมีระดับบนสุดชื่อ <strong>Unified Operations</strong> (Enterprise On-Ramp ทยอยเลิก) ข้อมูลนี้ยังไม่ได้ยืนยันกับหน้าทางการของ AWS ควรตรวจอีกครั้งก่อนสอบ แต่โจทย์ SAA-C03 ส่วนใหญ่ยังอ้างอิงชื่อแผนแบบเดิม</p>
            <div className="tip">หลักจำ: ต้อง Trusted Advisor ครบ + 24/7 สำหรับ production → Business | ต้องมี TAM เฉพาะ → Enterprise</div>
          </>
        ),
      },
      {
        title: "แนวทางลดค่าใช้จ่าย (Cost Optimization Patterns)",
        body: (
          <ul>
            <li><strong>Right-sizing</strong> — ลดขนาด instance ที่ใช้ไม่เต็ม (ดูจาก Compute Optimizer / CloudWatch)</li>
            <li>งาน steady-state → <strong>RI / Savings Plans</strong>; งานล่มได้/batch → <strong>Spot</strong>; งานไม่แน่นอน → On-Demand</li>
            <li>ปิด/ลบของที่ไม่ใช้: instance ที่ stop นานๆ, <strong>EBS volume ที่ไม่ได้ attach</strong>, snapshot เก่า, Elastic IP ที่ไม่ผูก, load balancer ที่ว่าง</li>
            <li>ปิด dev/test นอกเวลางานด้วย <strong>Instance Scheduler</strong> หรือ scheduled scaling</li>
            <li><strong>S3</strong>: ใช้ Lifecycle Policy / Intelligent-Tiering ย้ายข้อมูลไป class ที่ถูกกว่า</li>
            <li><strong>ลด data transfer</strong>: ใช้ CloudFront แคชใกล้ผู้ใช้, ใช้ <strong>Gateway VPC Endpoint</strong> สำหรับ S3/DynamoDB (ฟรี) แทนการวิ่งผ่าน NAT Gateway ที่คิดเงินตามปริมาณข้อมูล</li>
            <li>พิจารณา <strong>serverless</strong> (Lambda, Fargate, DynamoDB on-demand) เมื่อโหลดไม่คงที่ — จ่ายตามการใช้จริง</li>
            <li>ติด <strong>tag</strong> ทุก resource เพื่อรู้ว่าใครใช้เงินเท่าไหร่ และตั้ง <strong>Budgets</strong> แจ้งเตือนล่วงหน้า</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    cards: [
      {
        title: "บริการวิเคราะห์ข้อมูลบน S3 (ไม่ต้องย้ายข้อมูล)",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>ใช้เมื่อ</th></tr>
              <tr><td>Athena</td><td>Query S3 แบบ ad-hoc, serverless, SQL</td></tr>
              <tr><td>EMR</td><td>ต้องการคุม cluster Spark/Hadoop เอง</td></tr>
              <tr><td>Kinesis Data Analytics</td><td>วิเคราะห์ stream แบบ real-time</td></tr>
              <tr><td>QuickSight</td><td>สร้าง BI dashboard</td></tr>
              <tr><td>Amazon Forecast</td><td>ML forecasting แบบสำเร็จรูป (ต่างจาก SageMaker ที่ custom train model เอง)</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Amazon EMR — คืออะไร และเทียบกับ Athena / Glue / Redshift / ParallelCluster",
        body: (
          <>
            <p><strong>EMR (Elastic MapReduce)</strong> = บริการ managed สำหรับรัน big data framework (Hadoop, Spark, Hive, Presto/Trino, HBase, Flink) บน cluster EC2 โดย AWS ช่วยตั้งและจัดการ cluster ให้</p>
            <ul>
              <li>ประมวลผลข้อมูลก้อนใหญ่ (TB–PB) แบบกระจาย เช่น วิเคราะห์ log, clickstream, ETL ปริมาณมาก, ML บน Spark</li>
              <li>อ่าน/เขียน <strong>S3 ตรงๆ</strong> (EMRFS) แยก storage ออกจาก compute จึงปิด cluster ตอนไม่ใช้เพื่อประหยัดได้</li>
              <li>ใช้ <strong>Spot Instance</strong> กับ task node ลดต้นทุน | มีรูปแบบ EMR on EC2, EMR on EKS และ <strong>EMR Serverless</strong></li>
            </ul>
            <table>
              <tbody>
                <tr><th>บริการ</th><th>ใช้เมื่อ</th></tr>
                <tr><td><strong>EMR</strong></td><td>รัน Spark/Hadoop เอง คุม framework งานประมวลผลซับซ้อน</td></tr>
                <tr><td><strong>Athena</strong></td><td>query ข้อมูลใน S3 ด้วย SQL แบบ serverless ไม่มี cluster</td></tr>
                <tr><td><strong>AWS Glue</strong></td><td>ETL แบบ serverless (รัน Spark ให้โดยไม่ต้องจัดการ cluster)</td></tr>
                <tr><td><strong>Redshift</strong></td><td>data warehouse สำหรับ SQL วิเคราะห์ข้อมูลที่โหลดเข้ามาแล้ว</td></tr>
                <tr><td><strong>Kinesis</strong></td><td>ประมวลผล stream แบบ real-time</td></tr>
                <tr><td><strong>AWS ParallelCluster</strong></td><td>จัดการ <strong>HPC cluster</strong> (งานคำนวณวิทยาศาสตร์/วิศวกรรมที่ต้องการ low-latency ระหว่างโหนด) ไม่ใช่งาน log analytics</td></tr>
              </tbody>
            </table>
            <h4>โจทย์ตัวอย่าง: เก็บและประมวลผล application log จาก EC2 หลายเครื่องเพื่อทำรายงาน</h4>
            <p>ตอบ <strong>S3 (เก็บ) + EMR (ประมวลผล)</strong></p>
            <ul>
              <li><strong>Glacier / Deep Archive</strong> ดึงข้อมูลช้า (หลายชั่วโมง) ไม่เหมาะกับข้อมูลที่ต้องเอามา process</li>
              <li><strong>ParallelCluster</strong> = HPC ไม่ใช่ log analytics</li>
              <li><strong>Spot Instance</strong> ล้วนๆ อาจถูกเรียกคืนกลางงาน | <strong>EC2 เครื่องเดียว</strong> = single point of failure ขยายไม่ได้</li>
              <li>ข้อความ &quot;Nitro / On-Demand&quot; ในโจทย์เป็นแค่ข้อมูลประกอบ</li>
            </ul>
            <p className="trap">กับดัก: &quot;เก็บแล้วต้องเอามาประมวลผล&quot; ห้ามเก็บใน Glacier / Deep Archive</p>
            <div className="tip">หลักจำ: Hadoop / Spark / Hive / big data processing → EMR | query S3 ด้วย SQL แบบ serverless → Athena | ETL serverless → Glue | data warehouse → Redshift | HPC → ParallelCluster</div>
          </>
        ),
      },
    ],
  },
  {
    id: "governance",
    title: "Governance & Org",
    cards: [
      {
        title: "Service Control Policy (SCP) vs AWS Control Tower",
        body: (
          <>
            <table><tbody>
          <tr><th>SCP</th><th>AWS Control Tower</th></tr>
          <tr><td>Policy ที่ใช้ <strong>"จำกัดเพดานสิทธิ์สูงสุด"</strong> ของทุก account ใน AWS Organizations (แม้เป็น root user ก็ทำเกิน SCP ไม่ได้)</td><td>บริการที่ตั้ง <strong>multi-account landing zone</strong> ให้อัตโนมัติ — สร้าง OU, account, guardrail (ซึ่งหลายตัวสร้างจาก SCP ให้) และ account vending</td></tr>
        </tbody></table>
        <p className="trap">กับดัก: SCP คือ "เครื่องมือ" กำหนด guardrail ส่วน Control Tower คือ "ระบบจัดการ" ที่ครอบ SCP + อื่นๆไว้อีกชั้น ไม่ใช่สิ่งเดียวกัน</p>
          </>
        ),
      },
    ],
  },
  {
    id: "api",
    title: "API & Edge",
    cards: [
      {
        title: "API Gateway Custom Domain + ACM Certificate Region",
        body: (
          <>
            <table><tbody>
          <tr><th>Edge-Optimized Endpoint</th><th>Regional Endpoint</th></tr>
          <tr><td>Certificate (ACM) ต้องอยู่ที่ <strong><code>us-east-1</code> เท่านั้น</strong> (เพราะไปผ่าน CloudFront ด้านหลัง)</td><td>Certificate ต้องอยู่ <strong>region เดียวกับ API Gateway</strong> นั้นๆ (เช่น API อยู่ us-east-2 → cert ต้องอยู่ us-east-2 ด้วย)</td></tr>
        </tbody></table>
        <p className="trap">กับดัก: หลายคนจำว่า ACM ต้องอยู่ us-east-1 เสมอ (จริงสำหรับ CloudFront/Edge-optimized) แต่ถ้าใช้ Regional endpoint ต้องอยู่ region เดียวกับ API เอง</p>
        <div className="tip">หลักจำ: Edge-Optimized = ผ่าน CloudFront → cert ที่ us-east-1 | Regional = cert ตาม region ของ API Gateway นั้นเลย</div>
          </>
        ),
      },
    ],
  },
  {
    id: "resource-recap",
    title: "Resource Recap — สรุป AWS Resource แบบสั้น",
    cards: [
      {
        title: "วิธีใช้บทนี้ + ตัวช่วยจำ 1 บรรทัดต่อบริการ",
        body: (
          <>
            <p>บทนี้สรุป resource ที่ออกสอบ SAA-C03 บ่อย ทีละกลุ่ม แบบ <strong>&quot;คืออะไร / คำใบ้ในโจทย์&quot;</strong> อ่านคู่กับบทอื่นเมื่ออยากรู้รายละเอียด และทำแบบทดสอบท้ายบทเพื่อฝึกจับคู่โจทย์กับบริการ</p>
            <ul>
              <li>อ่านโจทย์ → จับ <strong>คำใบ้ (keyword)</strong> ก่อน → ตัดตัวเลือกที่ผิดประเภท → ค่อยเทียบตัวที่เหลือ</li>
              <li>โจทย์มักมีคำว่า <strong>LEAST operational effort</strong> (ใช้ managed/serverless), <strong>cost-effective</strong> (เลือกถูกสุดที่ยังตรงเงื่อนไข), <strong>highly available</strong> (Multi-AZ), <strong>disaster recovery ข้าม region</strong> (ต้องมีข้อมูลนอก region)</li>
            </ul>
            <div className="tip">กลุ่มในบทนี้: Compute → Storage → Database → Networking → Security/Identity → Integration/Messaging → Analytics → Management/Governance → Migration/Transfer → AI/ML → ตัวที่สับสนบ่อย → Keyword cheat sheet</div>
          </>
        ),
      },
      {
        title: "Compute & Containers & Serverless",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>EC2</strong></td><td>เซิร์ฟเวอร์เสมือน เลือก OS/ขนาดเองได้ (IaaS)</td><td>คุมเครื่องเอง, lift-and-shift</td></tr>
              <tr><td><strong>Auto Scaling</strong></td><td>เพิ่ม/ลดจำนวน EC2 ตามโหลดหรือตามเวลา</td><td>รองรับโหลดเปลี่ยน, self-healing</td></tr>
              <tr><td><strong>ELB</strong></td><td>กระจายทราฟฟิก — <strong>ALB</strong> (L7 HTTP/HTTPS, path/host routing) | <strong>NLB</strong> (L4 TCP/UDP, latency ต่ำ, static/Elastic IP) | <strong>GWLB</strong> (ส่งผ่าน virtual appliance เช่น firewall)</td><td>กระจายโหลด, Multi-AZ</td></tr>
              <tr><td><strong>Lambda</strong></td><td>รันโค้ดแบบ serverless ตาม event จ่ายตามที่ใช้ (จำกัดเวลารันต่อครั้ง ~15 นาที)</td><td>event-driven, ไม่อยากดูแลเซิร์ฟเวอร์</td></tr>
              <tr><td><strong>Lambda@Edge / CloudFront Functions</strong></td><td>รันโค้ดที่ edge ของ CloudFront ใกล้ผู้ใช้</td><td>ประมวลผล request ใกล้ผู้ใช้</td></tr>
              <tr><td><strong>Elastic Beanstalk</strong></td><td>อัปโหลดโค้ด AWS จัดการ EC2/ELB/Scaling ให้ (PaaS)</td><td>deploy เว็บแอปเร็ว ไม่ยุ่งโครงสร้าง</td></tr>
              <tr><td><strong>ECS</strong> / <strong>EKS</strong> / <strong>Fargate</strong></td><td>ECS = container orchestration ของ AWS | EKS = Kubernetes | Fargate = รัน container แบบ serverless (ไม่ต้องจัดการ EC2)</td><td>container, microservices; ไม่อยากจัดการเครื่อง → Fargate</td></tr>
              <tr><td><strong>AWS Batch</strong></td><td>รันงาน batch ปริมาณมากบน container/EC2/Spot</td><td>ประมวลผลเป็นชุดขนาดใหญ่</td></tr>
              <tr><td><strong>Lightsail</strong></td><td>VPS ง่ายๆ ราคาคงที่</td><td>เว็บเล็ก/dev ไม่ซับซ้อน</td></tr>
              <tr><td><strong>Outposts</strong></td><td>ฮาร์ดแวร์ AWS ติดตั้งใน data center ของเรา</td><td>hybrid, ต้องการ AWS on-premises</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Storage",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>S3</strong></td><td>Object storage ไม่จำกัดขนาด ทนทาน 11 nines มีหลาย storage class</td><td>เก็บไฟล์/รูป/backup, static website, data lake</td></tr>
              <tr><td><strong>S3 Glacier</strong></td><td>class สำหรับ archive ราคาถูก (Instant / Flexible / Deep Archive)</td><td>เก็บระยะยาว, compliance</td></tr>
              <tr><td><strong>EBS</strong></td><td>Block storage ติดกับ EC2 (AZ เดียว) — gp3/io2 (SSD), st1/sc1 (HDD)</td><td>disk ของ EC2, database, IOPS</td></tr>
              <tr><td><strong>Instance Store</strong></td><td>disk ติดเครื่อง เร็วมาก แต่ข้อมูลชั่วคราว</td><td>cache/buffer, ข้อมูลหายได้</td></tr>
              <tr><td><strong>EFS</strong></td><td>File system แบบ NFS แชร์ได้หลาย EC2 (Linux) ข้ามหลาย AZ</td><td>shared file, Linux, หลายเครื่องอ่านเขียนพร้อมกัน</td></tr>
              <tr><td><strong>FSx</strong></td><td>Managed file system 4 แบบ: <strong>Windows</strong> (SMB+AD) | <strong>Lustre</strong> (HPC/ML, ต่อ S3) | <strong>NetApp ONTAP</strong> | <strong>OpenZFS</strong></td><td>Windows file server → FSx for Windows; HPC → Lustre</td></tr>
              <tr><td><strong>Storage Gateway</strong></td><td>เชื่อม on-premises กับ AWS (File / Volume / Tape gateway)</td><td>hybrid storage, แทน tape เก่า</td></tr>
              <tr><td><strong>AWS Backup</strong></td><td>จัดการ backup รวมศูนย์ข้ามหลายบริการ</td><td>นโยบาย backup กลาง</td></tr>
              <tr><td><strong>Snow Family</strong> (Snowcone / Snowball / Snowmobile)</td><td>อุปกรณ์ขนย้ายข้อมูลแบบ offline เข้า AWS</td><td>ข้อมูลมหาศาล เน็ตช้า/ไม่คุ้ม</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Database",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>RDS</strong></td><td>Relational DB managed (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) — Multi-AZ = HA, Read Replica = scale อ่าน</td><td>SQL, transaction (OLTP)</td></tr>
              <tr><td><strong>Aurora</strong></td><td>DB ของ AWS เข้ากันได้กับ MySQL/PostgreSQL เร็วกว่า replica ได้ 15 ตัว storage ขยายเอง</td><td>performance/HA สูงกว่า RDS ทั่วไป</td></tr>
              <tr><td><strong>DynamoDB</strong></td><td>NoSQL key-value ระดับ ms serverless — Global Tables, DAX, Streams, TTL</td><td>scale มหาศาล, latency ต่ำ, schema ยืดหยุ่น</td></tr>
              <tr><td><strong>ElastiCache</strong></td><td>In-memory cache (Redis / Memcached)</td><td>แคช, session, ลดโหลด DB</td></tr>
              <tr><td><strong>DAX</strong></td><td>แคชเฉพาะ DynamoDB ระดับไมโครวินาที</td><td>DynamoDB อ่านเร็วขึ้นโดยแก้โค้ดน้อย</td></tr>
              <tr><td><strong>Redshift</strong></td><td>Data warehouse (OLAP) วิเคราะห์ข้อมูลก้อนใหญ่ด้วย SQL แบบ columnar; Spectrum query ข้อมูลใน S3 ได้</td><td>data warehouse, BI, analytics</td></tr>
              <tr><td><strong>DocumentDB</strong></td><td>Document DB เข้ากันได้กับ MongoDB</td><td>MongoDB workload</td></tr>
              <tr><td><strong>Neptune</strong></td><td>Graph database</td><td>ความสัมพันธ์/social graph, fraud</td></tr>
              <tr><td><strong>Keyspaces</strong></td><td>Cassandra แบบ managed</td><td>Cassandra workload</td></tr>
              <tr><td><strong>Timestream</strong></td><td>Time-series database</td><td>IoT, metric ตามเวลา</td></tr>
              <tr><td><strong>OpenSearch Service</strong></td><td>Search + log analytics (ต่อยอดจาก Elasticsearch)</td><td>full-text search, วิเคราะห์ log</td></tr>
              <tr><td><strong>DMS</strong> / <strong>SCT</strong></td><td>DMS ย้าย database (ต่อเนื่องได้) | SCT แปลง schema ต่างชนิด DB</td><td>ย้าย DB เข้า AWS, เปลี่ยนชนิด DB</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Networking & Content Delivery",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>VPC</strong> / Subnet</td><td>เครือข่ายส่วนตัวของเราบน AWS แบ่งเป็น subnet (public/private) ผูกกับ AZ เดียว</td><td>แยกเครือข่าย, CIDR</td></tr>
              <tr><td><strong>Route Table</strong></td><td>กำหนดเส้นทางแพ็กเก็ตของ subnet (Destination → Target)</td><td>public = มี route ไป IGW</td></tr>
              <tr><td><strong>Internet Gateway (IGW)</strong></td><td>ประตู VPC ↔ อินเทอร์เน็ต (ฟรี) ต้องมี public IP</td><td>เข้า/ออกอินเทอร์เน็ตตรงๆ</td></tr>
              <tr><td><strong>NAT Gateway</strong></td><td>ให้ private subnet ออกอินเทอร์เน็ตได้ แต่ข้างนอกเข้ามาเองไม่ได้ (อยู่ public subnet + Elastic IP)</td><td>private ออกเน็ตได้ ห้ามถูกเข้า</td></tr>
              <tr><td><strong>Security Group</strong> / <strong>NACL</strong></td><td>SG = ไฟร์วอลล์ระดับ instance (stateful, Allow เท่านั้น) | NACL = ระดับ subnet (stateless, Allow+Deny เรียงเลข rule)</td><td>บล็อก IP เฉพาะ → NACL</td></tr>
              <tr><td><strong>VPC Endpoint</strong></td><td>เข้า AWS service โดยไม่ออกอินเทอร์เน็ต — Gateway (S3/DynamoDB ฟรี) | Interface/PrivateLink (service อื่น, ต่อจาก on-prem ได้)</td><td>private subnet เข้า S3 โดยไม่ผ่าน NAT</td></tr>
              <tr><td><strong>VPC Peering</strong></td><td>เชื่อม 2 VPC แบบตรง (ไม่ transitive, CIDR ห้ามซ้อน)</td><td>เชื่อม VPC จำนวนน้อย</td></tr>
              <tr><td><strong>Transit Gateway</strong></td><td>ฮับกลางเชื่อมหลาย VPC + on-premises</td><td>เชื่อมหลาย VPC แบบ hub-and-spoke</td></tr>
              <tr><td><strong>Site-to-Site VPN</strong> / <strong>Direct Connect</strong></td><td>VPN = เข้ารหัสผ่านอินเทอร์เน็ต ตั้งเร็ว | Direct Connect = สายเฉพาะ latency/แบนด์วิดท์คงที่ (ตั้งนานกว่า)</td><td>on-prem ↔ AWS</td></tr>
              <tr><td><strong>Route 53</strong></td><td>DNS + routing policy (simple, weighted, latency, failover, geolocation, geoproximity) + health check</td><td>ชื่อโดเมน, failover, ชี้ผู้ใช้ไป region ใกล้</td></tr>
              <tr><td><strong>CloudFront</strong></td><td>CDN แคชเนื้อหาที่ edge; ใช้ signed URL/cookies จำกัดผู้เข้าถึง</td><td>เร็วขึ้นทั่วโลก, static/dynamic content</td></tr>
              <tr><td><strong>Global Accelerator</strong></td><td>ได้ static IP 2 ตัว ส่ง traffic ผ่านเครือข่าย AWS ไป endpoint ที่ใกล้/ปกติ</td><td>IP คงที่ระดับ global, TCP/UDP, failover เร็ว</td></tr>
              <tr><td><strong>API Gateway</strong></td><td>สร้าง/จัดการ API (REST/HTTP/WebSocket) throttling, caching, auth</td><td>เปิด API ให้ client / ต่อ Lambda</td></tr>
              <tr><td><strong>VPC Flow Logs</strong></td><td>บันทึกข้อมูล traffic ที่เข้า-ออก network interface</td><td>วิเคราะห์ traffic, ตรวจสอบเครือข่าย</td></tr>
              <tr><td><strong>Elastic IP</strong></td><td>public IPv4 คงที่ของ account (ต้อง release เอง)</td><td>IP คงที่, whitelist</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Security, Identity & Compliance",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>IAM</strong></td><td>จัดการ user/group/role/policy (ฟรี) — role ให้สิทธิ์ชั่วคราวแก่ service/คน/account อื่น</td><td>สิทธิ์เข้าถึง AWS</td></tr>
              <tr><td><strong>STS</strong></td><td>ออก temporary credentials (AssumeRole, AssumeRoleWithSAML/WebIdentity ฯลฯ)</td><td>credential ชั่วคราว, federation</td></tr>
              <tr><td><strong>IAM Identity Center</strong></td><td>SSO ให้พนักงานเข้าหลาย AWS account / แอป (ชื่อเดิม AWS SSO)</td><td>SSO พนักงาน, multi-account</td></tr>
              <tr><td><strong>Cognito</strong></td><td>สมัคร/ล็อกอินผู้ใช้ของแอปเรา (User pool) + ให้สิทธิ์ AWS (Identity pool)</td><td>user ของเว็บ/มือถือ, social login</td></tr>
              <tr><td><strong>Organizations</strong> / <strong>SCP</strong></td><td>จัดการหลาย account, consolidated billing; SCP กำหนดเพดานสิทธิ์ (guardrail)</td><td>หลาย account, จำกัดสิทธิ์ทั้ง OU</td></tr>
              <tr><td><strong>Control Tower</strong></td><td>ตั้ง landing zone หลาย account พร้อม guardrail อัตโนมัติ</td><td>ตั้งสภาพแวดล้อมหลาย account ตามแนวปฏิบัติ</td></tr>
              <tr><td><strong>KMS</strong> / <strong>CloudHSM</strong></td><td>KMS = จัดการ encryption key (managed) | CloudHSM = HSM เฉพาะของเรา (คุม key เอง ระดับ FIPS 140-2 Level 3)</td><td>เข้ารหัส / ต้องคุม HSM เอง</td></tr>
              <tr><td><strong>Secrets Manager</strong> / <strong>SSM Parameter Store</strong></td><td>Secrets Manager = เก็บและ <strong>หมุน (rotate) secret อัตโนมัติ</strong> (เช่น รหัส DB) | Parameter Store = เก็บค่า config/secret ธรรมดา ราคาถูก</td><td>rotate password DB → Secrets Manager</td></tr>
              <tr><td><strong>ACM</strong></td><td>ออก/ต่ออายุ SSL/TLS certificate ฟรีใช้กับ ELB/CloudFront/API Gateway</td><td>HTTPS certificate</td></tr>
              <tr><td><strong>WAF</strong></td><td>ไฟร์วอลล์ระดับเว็บ (L7) กรอง SQL injection, XSS, rate-limit, IP</td><td>ป้องกันโจมตีเว็บ</td></tr>
              <tr><td><strong>Shield</strong></td><td>ป้องกัน DDoS (Standard ฟรี / Advanced มีทีมช่วยเหลือ)</td><td>DDoS</td></tr>
              <tr><td><strong>Firewall Manager</strong></td><td>จัดการกฎ WAF/SG/Shield รวมศูนย์ข้ามหลาย account</td><td>บังคับกฎไฟร์วอลล์ทุก account</td></tr>
              <tr><td><strong>GuardDuty</strong></td><td>ตรวจจับภัยคุกคามจาก log (CloudTrail, VPC Flow Logs, DNS) ด้วย ML</td><td>ตรวจ threat/พฤติกรรมน่าสงสัย</td></tr>
              <tr><td><strong>Inspector</strong></td><td>สแกนช่องโหว่ EC2 / container image / Lambda</td><td>vulnerability scan</td></tr>
              <tr><td><strong>Macie</strong></td><td>ค้นหาข้อมูลอ่อนไหว (PII) ใน S3 ด้วย ML</td><td>หา PII ใน S3</td></tr>
              <tr><td><strong>Security Hub</strong> / <strong>Detective</strong></td><td>Security Hub = รวมผลตรวจความปลอดภัยจากหลายบริการ | Detective = สืบหาต้นตอเหตุการณ์</td><td>แดชบอร์ดรวม / สืบสวนเหตุ</td></tr>
              <tr><td><strong>Artifact</strong></td><td>ดาวน์โหลดรายงาน compliance/สัญญาของ AWS (เช่น SOC, ISO)</td><td>เอกสารรับรอง compliance ของ AWS</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Integration & Messaging",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>SQS</strong></td><td>คิวข้อความ (pull) Standard = at-least-once ลำดับ best-effort | FIFO = เรียงลำดับ + ไม่ซ้ำ; มี DLQ</td><td>decouple, buffer งาน, worker</td></tr>
              <tr><td><strong>SNS</strong></td><td>Pub/sub ส่งต่อหลายผู้รับ (email, SMS, SQS, Lambda, HTTP)</td><td>broadcast, fan-out, แจ้งเตือน</td></tr>
              <tr><td><strong>EventBridge</strong></td><td>Event bus + rule route event จาก AWS/SaaS/แอป + schedule</td><td>event-driven, schedule</td></tr>
              <tr><td><strong>Kinesis Data Streams</strong></td><td>Stream real-time เรียงลำดับตาม shard/partition key เก็บ/อ่านซ้ำได้</td><td>clickstream, log, IoT</td></tr>
              <tr><td><strong>Data Firehose</strong></td><td>ส่ง streaming ไป S3/Redshift/OpenSearch อัตโนมัติ ไม่ต้องเขียน consumer</td><td>โหลด stream เข้า S3/Redshift</td></tr>
              <tr><td><strong>Step Functions</strong></td><td>ร้อย workflow หลายขั้นตอน (Lambda/บริการอื่น) แบบ state machine</td><td>orchestrate ขั้นตอน, retry/branch</td></tr>
              <tr><td><strong>Amazon MQ</strong></td><td>ActiveMQ/RabbitMQ แบบ managed (JMS, AMQP, MQTT)</td><td>ย้าย message broker เดิมโดยไม่แก้โค้ด</td></tr>
              <tr><td><strong>MSK</strong></td><td>Apache Kafka แบบ managed</td><td>Kafka workload</td></tr>
              <tr><td><strong>AppSync</strong></td><td>GraphQL API แบบ managed (real-time)</td><td>GraphQL</td></tr>
              <tr><td><strong>SES</strong></td><td>ส่งอีเมลปริมาณมาก (transactional/marketing)</td><td>ส่ง email จากแอป</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Analytics & Data",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>Athena</strong></td><td>Query ข้อมูลใน S3 ด้วย SQL แบบ serverless จ่ายตามข้อมูลที่สแกน</td><td>ad-hoc query ไฟล์ใน S3 ไม่ต้องมี cluster</td></tr>
              <tr><td><strong>Glue</strong></td><td>ETL แบบ serverless + Data Catalog (จัดโครงสร้างข้อมูล)</td><td>แปลง/โหลดข้อมูล, catalog schema</td></tr>
              <tr><td><strong>EMR</strong></td><td>Hadoop/Spark cluster แบบ managed ประมวลผลข้อมูลมหาศาล</td><td>big data processing, Spark</td></tr>
              <tr><td><strong>Redshift</strong></td><td>Data warehouse วิเคราะห์ข้อมูลก้อนใหญ่ (OLAP)</td><td>BI, รายงานข้ามข้อมูลหลายแหล่ง</td></tr>
              <tr><td><strong>QuickSight</strong></td><td>BI dashboard / visualization</td><td>ทำ dashboard ให้ผู้บริหาร</td></tr>
              <tr><td><strong>Lake Formation</strong></td><td>สร้าง/คุมสิทธิ์ data lake บน S3</td><td>data lake + สิทธิ์ละเอียด</td></tr>
              <tr><td><strong>OpenSearch</strong></td><td>Search + log analytics + dashboard</td><td>ค้นหา/วิเคราะห์ log</td></tr>
              <tr><td><strong>Kinesis (Streams / Firehose / Flink)</strong></td><td>ประมวลผล/ส่ง streaming ข้อมูล real-time</td><td>real-time analytics</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Management, Governance & Cost",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>CloudWatch</strong></td><td>Metrics + Logs + Alarms + Dashboards (ดูสุขภาพ/ประสิทธิภาพ)</td><td>monitor, alarm, ดู log แอป</td></tr>
              <tr><td><strong>CloudTrail</strong></td><td>บันทึก <strong>API call ใครทำอะไรเมื่อไหร่</strong> (audit)</td><td>ใครลบ/แก้ resource</td></tr>
              <tr><td><strong>Config</strong></td><td>บันทึก <strong>ค่าตั้งของ resource ย้อนหลัง</strong> + ประเมิน compliance ตาม rule</td><td>resource ตรงตามเงื่อนไขไหม, ประวัติ config</td></tr>
              <tr><td><strong>Systems Manager</strong></td><td>ดูแล fleet: Session Manager (เข้าเครื่องไม่ต้องเปิด SSH), Patch Manager, Parameter Store, Run Command</td><td>ดูแล/patch เครื่องจำนวนมาก</td></tr>
              <tr><td><strong>CloudFormation</strong></td><td>สร้าง infrastructure จากเทมเพลต (IaC) ทำซ้ำได้</td><td>IaC, สร้างสภาพแวดล้อมซ้ำ</td></tr>
              <tr><td><strong>Trusted Advisor</strong></td><td>ตรวจ best practice 5 ด้าน: cost, performance, security, fault tolerance, service limits</td><td>คำแนะนำภาพรวมของ account</td></tr>
              <tr><td><strong>Compute Optimizer</strong></td><td>แนะนำ rightsizing (EC2, EBS, Lambda ฯลฯ) จากการใช้งานจริง</td><td>ปรับขนาดเครื่องให้เหมาะ</td></tr>
              <tr><td><strong>Well-Architected Tool</strong></td><td>ทบทวน architecture ตาม 6 pillars</td><td>architectural review</td></tr>
              <tr><td><strong>Service Catalog</strong></td><td>แคตตาล็อกของ product ที่ได้รับอนุมัติให้ทีมใช้</td><td>คุมมาตรฐานสิ่งที่ผู้ใช้ deploy ได้</td></tr>
              <tr><td><strong>Health Dashboard</strong></td><td>สถานะบริการ AWS และเหตุการณ์ที่กระทบ account เรา</td><td>เช็คว่า AWS มีปัญหาไหม</td></tr>
              <tr><td><strong>Cost Explorer / Budgets / CUR / Pricing Calculator</strong></td><td>ดูและวิเคราะห์ค่าใช้จ่าย | ตั้งงบและแจ้งเตือน | รายงานละเอียดที่สุด | ประมาณราคาก่อนใช้</td><td>วิเคราะห์/คุม/ประมาณ cost</td></tr>
              <tr><td><strong>Savings Plans / Reserved / Spot</strong></td><td>ส่วนลดเมื่อผูกพันระยะยาว | จองล่วงหน้า | ใช้ความจุเหลือถูกสุดแต่ถูกเรียกคืนได้</td><td>ลดค่า EC2: งานคงที่ → Savings/Reserved, งานคั่นได้ → Spot</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Migration & Data Transfer",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>คืออะไร (สั้นๆ)</th><th>คำใบ้ในโจทย์</th></tr>
              <tr><td><strong>DataSync</strong></td><td>ย้ายไฟล์/object ปริมาณมากแบบอัตโนมัติ (NFS/SMB/HDFS/S3/EFS/FSx)</td><td>ย้ายข้อมูลไฟล์ on-prem ↔ AWS, ตั้งเวลา</td></tr>
              <tr><td><strong>Snow Family</strong></td><td>ขนข้อมูลแบบ offline ด้วยอุปกรณ์จริง</td><td>ข้อมูลมหาศาล เครือข่ายช้า</td></tr>
              <tr><td><strong>Storage Gateway</strong></td><td>ใช้งาน storage แบบ hybrid ต่อเนื่อง (cache ในองค์กร)</td><td>เข้าถึง S3 ผ่านโปรโตคอลเดิมจาก on-prem</td></tr>
              <tr><td><strong>Transfer Family</strong></td><td>SFTP/FTPS/FTP เข้า S3/EFS</td><td>พาร์ตเนอร์ส่งไฟล์ผ่าน SFTP</td></tr>
              <tr><td><strong>DMS</strong> + <strong>SCT</strong></td><td>ย้าย database (ต่อเนื่องได้) + แปลง schema</td><td>ย้าย DB, เปลี่ยนชนิด DB</td></tr>
              <tr><td><strong>Application Migration Service (MGN)</strong></td><td>lift-and-shift ย้ายเซิร์ฟเวอร์ไป EC2</td><td>ย้ายเครื่องทั้งดวงขึ้น AWS</td></tr>
              <tr><td><strong>Migration Hub</strong></td><td>ติดตามความคืบหน้าการย้ายรวมศูนย์</td><td>ติดตามหลายงานย้าย</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "AI / ML Services (ที่ออกสอบระดับพื้นฐาน)",
        body: (
          <table>
            <tbody>
              <tr><th>บริการ</th><th>ทำอะไร</th></tr>
              <tr><td><strong>Rekognition</strong></td><td>วิเคราะห์ภาพ/วิดีโอ (ตรวจใบหน้า, วัตถุ, เนื้อหาไม่เหมาะสม)</td></tr>
              <tr><td><strong>Textract</strong></td><td>ดึงข้อความ/ตาราง/ฟอร์มจากเอกสารสแกน (OCR+)</td></tr>
              <tr><td><strong>Transcribe</strong></td><td>เสียง → ข้อความ</td></tr>
              <tr><td><strong>Polly</strong></td><td>ข้อความ → เสียงพูด</td></tr>
              <tr><td><strong>Translate</strong></td><td>แปลภาษา</td></tr>
              <tr><td><strong>Comprehend</strong></td><td>วิเคราะห์ข้อความ (sentiment, entities, ภาษา)</td></tr>
              <tr><td><strong>Lex</strong></td><td>สร้าง chatbot / voice bot</td></tr>
              <tr><td><strong>Kendra</strong></td><td>ค้นหาองค์กรแบบฉลาด (ถาม-ตอบจากเอกสาร)</td></tr>
              <tr><td><strong>SageMaker</strong></td><td>สร้าง/ฝึก/deploy โมเดล ML เอง</td></tr>
              <tr><td><strong>Bedrock</strong></td><td>เรียกใช้ foundation model (generative AI) ผ่าน API</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "ตัวที่สับสนบ่อย — แยกให้ออก",
        body: (
          <table>
            <tbody>
              <tr><th>คู่/กลุ่มที่สับสน</th><th>แยกอย่างไร</th></tr>
              <tr><td><strong>CloudTrail vs CloudWatch vs Config</strong></td><td>CloudTrail = <strong>ใครเรียก API ทำอะไร</strong> | CloudWatch = <strong>เมตริก/log/alarm</strong> ของประสิทธิภาพ | Config = <strong>ค่าตั้งของ resource + compliance</strong></td></tr>
              <tr><td><strong>Security Group vs NACL</strong></td><td>SG = instance, stateful, Allow เท่านั้น | NACL = subnet, stateless, Allow+Deny, เรียงเลข rule</td></tr>
              <tr><td><strong>GuardDuty vs Inspector vs Macie</strong></td><td>GuardDuty = ตรวจ threat/พฤติกรรมน่าสงสัย | Inspector = สแกนช่องโหว่ซอฟต์แวร์ | Macie = หา PII ใน S3</td></tr>
              <tr><td><strong>WAF vs Shield</strong></td><td>WAF = กรองคำขอเว็บ (SQLi/XSS) | Shield = กัน DDoS</td></tr>
              <tr><td><strong>Secrets Manager vs Parameter Store</strong></td><td>Secrets Manager = rotate อัตโนมัติ (แพงกว่า) | Parameter Store = เก็บค่า config/secret ธรรมดา (ถูก)</td></tr>
              <tr><td><strong>KMS vs CloudHSM</strong></td><td>KMS = managed key service | CloudHSM = HSM เฉพาะ คุม key เอง</td></tr>
              <tr><td><strong>VPN vs Direct Connect</strong></td><td>VPN = ผ่านอินเทอร์เน็ต เข้ารหัส ตั้งเร็ว | DX = สายส่วนตัว latency คงที่ ตั้งนานกว่า (ต้องการเข้ารหัสเพิ่มต้องทำ VPN over DX)</td></tr>
              <tr><td><strong>Peering vs Transit Gateway vs PrivateLink</strong></td><td>Peering = 2 VPC ตรง (ไม่ transitive) | TGW = hub หลาย VPC | PrivateLink = เปิด service เดียวให้ VPC อื่นแบบส่วนตัว</td></tr>
              <tr><td><strong>CloudFront vs Global Accelerator</strong></td><td>CloudFront = <strong>แคช</strong> เนื้อหา HTTP(S) ที่ edge | Global Accelerator = <strong>static IP</strong> + route ผ่านเครือข่าย AWS (TCP/UDP) ไม่แคช</td></tr>
              <tr><td><strong>ALB vs NLB vs GWLB</strong></td><td>ALB = L7 HTTP path/host | NLB = L4 latency ต่ำ static IP | GWLB = ส่งผ่าน appliance</td></tr>
              <tr><td><strong>SQS vs SNS vs EventBridge vs Kinesis</strong></td><td>SQS = คิวงาน | SNS = broadcast | EventBridge = route event ตามกฎ | Kinesis = stream ลำดับ + replay</td></tr>
              <tr><td><strong>Athena vs Redshift vs EMR vs Glue</strong></td><td>Athena = SQL บน S3 แบบ ad-hoc | Redshift = data warehouse | EMR = Spark/Hadoop | Glue = ETL + catalog</td></tr>
              <tr><td><strong>S3 vs EBS vs EFS vs FSx</strong></td><td>S3 = object | EBS = block ติด EC2 (AZ เดียว) | EFS = NFS Linux แชร์ | FSx = Windows/Lustre/ONTAP/OpenZFS</td></tr>
              <tr><td><strong>RDS vs Aurora vs DynamoDB vs Redshift</strong></td><td>RDS/Aurora = relational OLTP | DynamoDB = NoSQL key-value | Redshift = warehouse OLAP</td></tr>
              <tr><td><strong>Multi-AZ vs Read Replica vs Multi-Region</strong></td><td>Multi-AZ = HA (AZ ล่ม) | Read Replica = scale การอ่าน | ข้าม region = DR (region ล่ม)</td></tr>
              <tr><td><strong>IAM Identity Center vs Cognito</strong></td><td>Identity Center = พนักงานเข้า AWS/แอปองค์กร | Cognito = ผู้ใช้ของแอปเราเอง</td></tr>
            </tbody>
          </table>
        ),
      },
      {
        title: "Keyword Cheat Sheet — เห็นคำนี้ ตอบนี้",
        body: (
          <>
            <table>
              <tbody>
                <tr><th>คำใบ้ในโจทย์</th><th>มักตอบ</th></tr>
                <tr><td>ไม่อยากดูแลเซิร์ฟเวอร์ / serverless / LEAST operational effort</td><td>Lambda, Fargate, managed service, managed rule</td></tr>
                <tr><td>ลำดับ + ไม่หาย + streaming + ย้อนอ่านได้</td><td>Kinesis Data Streams</td></tr>
                <tr><td>ลำดับ + ไม่ซ้ำ (คิวงาน)</td><td>SQS FIFO</td></tr>
                <tr><td>ส่งถึงหลายระบบพร้อมกัน (fan-out)</td><td>SNS (+SQS)</td></tr>
                <tr><td>ใครทำอะไรกับ resource (audit)</td><td>CloudTrail</td></tr>
                <tr><td>resource ตรงตามกฎไหม / ประวัติ config</td><td>AWS Config</td></tr>
                <tr><td>ฐานข้อมูล data warehouse / BI</td><td>Redshift</td></tr>
                <tr><td>query ไฟล์ใน S3 ด้วย SQL</td><td>Athena</td></tr>
                <tr><td>ไฟล์ทำซ้ำได้ + เข้าถึงน้อย + ต้องเร็ว</td><td>S3 One Zone-IA</td></tr>
                <tr><td>archive ถูกสุด ระยะยาว</td><td>Glacier Deep Archive</td></tr>
                <tr><td>ห้ามลบแม้ root จนกว่าครบกำหนด</td><td>S3 Object Lock (Compliance mode)</td></tr>
                <tr><td>IOPS สูง, transaction</td><td>EBS io1/io2</td></tr>
                <tr><td>throughput สูง sequential</td><td>EBS st1</td></tr>
                <tr><td>หลาย EC2 (Linux) แชร์ไฟล์</td><td>EFS</td></tr>
                <tr><td>Windows file server (SMB + AD)</td><td>FSx for Windows</td></tr>
                <tr><td>HPC / ML throughput สูง ต่อ S3</td><td>FSx for Lustre</td></tr>
                <tr><td>DynamoDB อ่านระดับไมโครวินาที</td><td>DAX</td></tr>
                <tr><td>แคชหน้า DB / session</td><td>ElastiCache</td></tr>
                <tr><td>private subnet ออกเน็ตได้ ห้ามถูกเข้า</td><td>NAT Gateway (public subnet + Elastic IP)</td></tr>
                <tr><td>private subnet เข้า S3 โดยไม่ผ่านเน็ต/ฟรี</td><td>Gateway VPC Endpoint</td></tr>
                <tr><td>บล็อก IP เฉพาะ</td><td>NACL deny (หรือ WAF)</td></tr>
                <tr><td>on-prem เชื่อมเครือข่ายเฉพาะ latency คงที่</td><td>Direct Connect</td></tr>
                <tr><td>ผู้ใช้ทั่วโลกเร็วขึ้น (แคช)</td><td>CloudFront</td></tr>
                <tr><td>static IP ระดับ global</td><td>Global Accelerator</td></tr>
                <tr><td>ชี้ผู้ใช้ไป endpoint ที่ latency ต่ำ / failover DNS</td><td>Route 53 (latency / failover)</td></tr>
                <tr><td>ประมวลผล request ใกล้ผู้ใช้ที่ edge</td><td>Lambda@Edge</td></tr>
                <tr><td>credential ชั่วคราว</td><td>STS / IAM Role</td></tr>
                <tr><td>พนักงานเข้าหลาย AWS account (SSO)</td><td>IAM Identity Center</td></tr>
                <tr><td>ผู้ใช้เว็บ/มือถือของเรา (สมัคร/social login)</td><td>Cognito</td></tr>
                <tr><td>จำกัดสิทธิ์ทั้ง OU/หลาย account</td><td>Organizations SCP</td></tr>
                <tr><td>rotate รหัส DB อัตโนมัติ</td><td>Secrets Manager</td></tr>
                <tr><td>กัน SQL injection / XSS</td><td>WAF</td></tr>
                <tr><td>กัน DDoS</td><td>Shield</td></tr>
                <tr><td>ตรวจพฤติกรรมน่าสงสัย</td><td>GuardDuty</td></tr>
                <tr><td>หา PII ใน S3</td><td>Macie</td></tr>
                <tr><td>สแกนช่องโหว่ EC2/container</td><td>Inspector</td></tr>
                <tr><td>DR ข้าม region: Redshift / S3 / DynamoDB / RDS</td><td>Snapshot Copy / CRR / Global Tables / Cross-Region Read Replica</td></tr>
                <tr><td>ย้ายไฟล์ on-prem อัตโนมัติ</td><td>DataSync</td></tr>
                <tr><td>ย้าย DB (ชนิดต่างกัน)</td><td>DMS + SCT</td></tr>
                <tr><td>ย้ายข้อมูลมหาศาล เน็ตช้า</td><td>Snow Family</td></tr>
                <tr><td>ร้อยหลายขั้นตอนเป็น workflow</td><td>Step Functions</td></tr>
                <tr><td>IaC สร้างสภาพแวดล้อมซ้ำ</td><td>CloudFormation</td></tr>
                <tr><td>เข้าเครื่องโดยไม่เปิด SSH/port</td><td>Systems Manager Session Manager</td></tr>
                <tr><td>ปรับขนาดเครื่องให้เหมาะ (rightsizing)</td><td>Compute Optimizer</td></tr>
                <tr><td>รายงานค่าใช้จ่ายละเอียดสุด / ตั้งงบเตือน / ประมาณราคา</td><td>CUR / Budgets / Pricing Calculator</td></tr>
              </tbody>
            </table>
            <div className="tip">เทคนิค: ตัดตัวเลือกที่ผิด &quot;ประเภท&quot; ก่อน (เช่น Athena ไม่ใช่ตัวรับ streaming, Route 53 ไม่รันโค้ด) แล้วค่อยเลือกตัวที่ภาระดูแลน้อยและถูกที่สุดที่ยังตรงเงื่อนไข</div>
            <p className="trap">หมายเหตุ: บทนี้สรุปจากความรู้เดิมระดับ overview ตัวเลขหรือรายละเอียดเฉพาะ (เช่น เพดาน, ชื่อ rule, ฟีเจอร์ใหม่) ควรเทียบเอกสาร AWS / Tutorials Dojo ก่อนสอบ</p>
          </>
        ),
      },
    ],
  },
];

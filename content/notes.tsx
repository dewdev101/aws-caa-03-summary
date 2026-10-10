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
    ],
  },
];

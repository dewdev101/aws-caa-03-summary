export type QuizQuestion = {
  q: string;
  options: string[];
  // index เดียว = เลือกข้อเดียว | array = Select TWO (เลือกหลายข้อ)
  correct: number | number[];
  explain: string;
};

export const quizzes: Record<string, QuizQuestion[]> = {
  networking: [
    {
      q: "AWS VPC/Subnet อนุญาตขนาด prefix (CIDR) ตั้งแต่เท่าไหร่ถึงเท่าไหร่?",
      options: ["/16 ถึง /28", "/8 ถึง /30", "/24 ถึง /32", "/0 ถึง /32"],
      correct: 0,
      explain:
        "AWS จำกัด VPC/Subnet ให้อยู่ในช่วง /16 (ใหญ่สุด) ถึง /28 (เล็กสุด) เท่านั้น",
    },
    {
      q: "Elastic IP จะถูกคืนกลับ AWS pool เมื่อไหร่?",
      options: [
        "ทันทีที่ stop instance",
        "ทันทีที่ terminate instance",
        "เมื่อกด release เท่านั้น",
        "หลัง 24 ชั่วโมงโดยอัตโนมัติ",
      ],
      correct: 2,
      explain:
        "Elastic IP ไม่หายไปเองเมื่อ stop/terminate instance — ต้อง release ด้วยตัวเองเท่านั้นถึงจะคืน IP กลับ pool (ถ้าปล่อยไว้เฉยๆจะโดนคิดค่า idle charge ด้วย)",
    },
    {
      q: "อะไรคือสิ่งที่ทำให้ subnet เป็น 'public subnet'?",
      options: [
        "ใส่ Security Group ที่เปิด port 80 ทุก instance",
        "Route table ของ subnet มี route 0.0.0.0/0 ชี้ไปที่ Internet Gateway",
        "มี NAT Gateway อยู่ใน subnet",
        "ใช้ CIDR block ที่เป็น public IP range",
      ],
      correct: 1,
      explain:
        "Public subnet = subnet ที่ route table มี 0.0.0.0/0 → IGW (และ instance ต้องมี public/Elastic IP ด้วยถึงจะออกอินเทอร์เน็ตได้) ไม่เกี่ยวกับ Security Group",
    },
    {
      q: "Instance ใน private subnet ต้องออกอินเทอร์เน็ตเพื่อโหลด patch แต่ห้ามให้ใครจากภายนอกเริ่ม connection เข้ามา ควรใช้อะไร?",
      options: [
        "Internet Gateway แล้วแนบ public IP ให้ instance",
        "NAT Gateway ใน public subnet พร้อม Elastic IP และแก้ route table ของ private subnet",
        "NAT Gateway ใน private subnet",
        "Egress-only Internet Gateway",
      ],
      correct: 1,
      explain:
        "NAT Gateway ต้องวางใน public subnet (มี EIP) แล้วให้ private subnet route 0.0.0.0/0 → NAT GW ส่วน Egress-only IGW ใช้กับ IPv6 เท่านั้น",
    },
    {
      q: "ข้อใดเป็นคุณสมบัติของ Security Group?",
      options: [
        "Stateful — ตอบกลับ traffic ที่อนุญาตขาเข้าได้อัตโนมัติ",
        "มีเฉพาะกฎ Allow ไม่มีกฎ Deny",
        "Stateless — ต้องเปิดกฎขาออกให้ response เอง",
        "ทำงานระดับ subnet และมีกฎ Deny ได้",
      ],
      correct: [0, 1],
      explain:
        "Security Group ทำงานระดับ instance/ENI, stateful และมีแต่ Allow ส่วน Stateless + Deny + ระดับ subnet คือ Network ACL",
    },
    {
      q: "ต้องการบล็อก IP address ของผู้โจมตีรายหนึ่งไม่ให้เข้า subnet ควรใช้อะไร?",
      options: [
        "Security Group deny rule",
        "Network ACL deny rule",
        "Route table blackhole เท่านั้น",
        "IAM policy",
      ],
      correct: 1,
      explain:
        "Security Group ไม่มี Deny จึงบล็อก IP เฉพาะรายไม่ได้ — ต้องใช้ NACL ที่เขียน Deny rule ได้ (หรือ AWS WAF ในระดับ application)",
    },
    {
      q: "NACL ของ subnet มี rule ขาเข้า: #100 ALLOW HTTP จาก 0.0.0.0/0 และ #200 DENY All traffic จาก 203.0.113.5/32 แพ็กเก็ต HTTP จาก 203.0.113.5 จะเป็นอย่างไร?",
      options: [
        "ถูกบล็อก เพราะ Deny มีผลเหนือ Allow เสมอ",
        "ผ่าน เพราะ rule #100 ตรงก่อนและ NACL หยุดประเมินทันที",
        "ถูกบล็อก เพราะเลขมากกว่าถูกประเมินก่อน",
        "ผ่านเฉพาะเมื่อ Security Group อนุญาตเท่านั้น และ NACL ไม่เกี่ยว",
      ],
      correct: 1,
      explain:
        "NACL ประเมินตามเลข rule จากน้อยไปมาก เจอ rule ที่ตรงก่อนก็ใช้อันนั้นแล้วหยุด — ต้องตั้ง Deny ให้เลขน้อยกว่า (เช่น #90) ถึงจะบล็อกได้",
    },
    {
      q: "Security Group ของ instance มี rule Allow พอร์ต 22 จาก 10.0.0.0/8 และอีก rule Allow พอร์ต 22 จาก 10.0.1.5/32 ข้อใดถูกต้องเกี่ยวกับการประเมิน rule?",
      options: [
        "ประเมินตามลำดับที่สร้าง rule แรกที่ตรงชนะ",
        "ไม่มีลำดับ ทุก rule ถูกรวมกัน ถ้ามี rule ใดตรงก็ผ่าน",
        "rule ที่เจาะจงกว่า (/32) มีผลก่อน",
        "ต้องตรงทุก rule ถึงจะผ่าน",
      ],
      correct: 1,
      explain:
        "Security Group ไม่มีเลขลำดับและไม่มี Deny — ประเมินทุก rule รวมกัน ถ้ามี rule Allow ใดตรงก็ผ่าน ไม่ตรงเลยก็ถูกปฏิเสธโดย default",
    },
    {
      q: "Traffic ขาเข้าจากอินเทอร์เน็ตมายัง EC2 ใน subnet จะผ่านด่านใดตามลำดับ?",
      options: [
        "Security Group → NACL → instance",
        "NACL → Security Group → instance",
        "NACL อย่างเดียว",
        "Security Group อย่างเดียว",
      ],
      correct: 1,
      explain:
        "ขาเข้าผ่าน NACL (ด่าน subnet) ก่อน แล้วค่อยผ่าน Security Group (ด่าน instance) ส่วนขาออกกลับกัน คือ SG → NACL และต้องผ่านทั้งสองด่าน",
    },
    {
      q: "Instance ใน private subnet ต้องเข้าถึง S3 โดยไม่ผ่านอินเทอร์เน็ต และไม่ต้องการเสียค่า NAT Gateway/endpoint รายชั่วโมง ควรใช้อะไร?",
      options: [
        "Interface VPC endpoint (PrivateLink)",
        "Gateway VPC endpoint สำหรับ S3",
        "NAT Gateway",
        "Direct Connect",
      ],
      correct: 1,
      explain:
        "Gateway endpoint ของ S3 (และ DynamoDB) ฟรี และทำงานผ่านการเพิ่ม route ใน route table ส่วน Interface endpoint มีค่าใช้จ่ายรายชั่วโมง + ค่าข้อมูล",
    },
    {
      q: "Service ใดที่รองรับ Gateway VPC endpoint?",
      options: [
        "S3 และ DynamoDB",
        "S3 และ SQS",
        "DynamoDB และ SNS",
        "ทุก AWS service",
      ],
      correct: 0,
      explain:
        "Gateway endpoint รองรับแค่ S3 และ DynamoDB เท่านั้น service อื่น (SQS, SNS, Kinesis ฯลฯ) ต้องใช้ Interface endpoint",
    },
    {
      q: "เครื่อง on-premises ต้องเรียก AWS service แบบ private ผ่าน Direct Connect/VPN โดยไม่ออกอินเทอร์เน็ต ควรใช้อะไร?",
      options: [
        "Gateway VPC endpoint",
        "Interface VPC endpoint (AWS PrivateLink)",
        "NAT Gateway",
        "Internet Gateway",
      ],
      correct: 1,
      explain:
        "Interface endpoint สร้าง ENI พร้อม private IP ใน VPC จึงเข้าถึงจาก on-prem ผ่าน DX/VPN ได้ ขณะที่ Gateway endpoint เข้าถึงจากนอก VPC ไม่ได้",
    },
    {
      q: "เมื่อใช้ NAT Instance (EC2) แทน NAT Gateway ต้องตั้งค่าอะไรเป็นพิเศษ?",
      options: [
        "ผูก Elastic IP เท่านั้น ไม่ต้องตั้งอะไรเพิ่ม",
        "ปิด Source/Destination check บน instance",
        "วางไว้ใน private subnet",
        "เปิด Multi-AZ",
      ],
      correct: 1,
      explain:
        "NAT instance ต้อง disable Source/Destination check เพราะต้องส่งต่อ traffic ที่ไม่ใช่ของตัวเอง (NAT Gateway จัดการให้เองและ managed ทั้งหมด)",
    },
    {
      q: "ต้องการให้การออกอินเทอร์เน็ตของ private subnet ทนต่อ AZ ล่ม ควรออกแบบอย่างไร?",
      options: [
        "NAT Gateway ตัวเดียวใน AZ ใดก็ได้",
        "NAT Gateway หนึ่งตัวต่อ AZ และให้ route table ของแต่ละ AZ ชี้ไป NAT GW ใน AZ ตัวเอง",
        "NAT Gateway ตัวเดียวแล้วเปิด Multi-AZ",
        "ใช้ Internet Gateway สองตัว",
      ],
      correct: 1,
      explain:
        "NAT Gateway เป็น resource ระดับ AZ (redundant ภายใน AZ เท่านั้น) จึงต้องสร้างต่อ AZ ส่วน IGW มีได้แค่ 1 ตัวต่อ VPC และ redundant อยู่แล้ว",
    },
    {
      q: "Route table ของ private subnet ควรมี route ใดเพื่อให้ EC2 ในนั้นออกอินเทอร์เน็ตได้ แต่ไม่ถูกเข้าจากภายนอก?",
      options: [
        "0.0.0.0/0 → igw-xxxx",
        "0.0.0.0/0 → nat-xxxx",
        "10.0.0.0/16 → nat-xxxx",
        "10.0.0.0/16 → igw-xxxx",
      ],
      correct: 1,
      explain:
        "Private subnet ส่งปลายทางที่เหลือทั้งหมด (0.0.0.0/0) ให้ NAT Gateway ส่วนปลายทางภายใน VPC ใช้ local อัตโนมัติ ไม่ต้องผ่าน NAT; ถ้าชี้ 0.0.0.0/0 ไป IGW subnet นั้นจะกลายเป็น public",
    },
    {
      q: "ใน route table ของ subnet หนึ่ง มี route 10.0.0.0/16 → local และ 0.0.0.0/0 → nat-xxxx แพ็กเก็ตจาก EC2 ไป 10.0.1.20 (เครื่องใน VPC เดียวกัน) จะไปทางไหน?",
      options: [
        "ผ่าน NAT Gateway เพราะ 0.0.0.0/0 ครอบคลุมทุก IP",
        "ส่งภายใน VPC ผ่าน local เพราะตรงแบบเจาะจงกว่า (longest prefix match)",
        "ถูกทิ้ง เพราะไม่มี route ไป IGW",
        "ผ่าน Internet Gateway",
      ],
      correct: 1,
      explain:
        "Route table เลือกแถวที่ตรงเจาะจงที่สุด 10.0.0.0/16 เจาะจงกว่า 0.0.0.0/0 จึงใช้ local",
    },
    {
      q: "NAT Gateway ถูกสร้างใน subnet ที่ route table มีเพียง 10.0.0.0/16 → local และผูก Elastic IP แล้ว EC2 ใน private subnet ที่ชี้ 0.0.0.0/0 มาที่ NAT GW นี้จะเป็นอย่างไร?",
      options: [
        "ออกอินเทอร์เน็ตได้ปกติ เพราะมี Elastic IP",
        "ออกอินเทอร์เน็ตไม่ได้ เพราะ subnet ของ NAT GW ไม่มี route 0.0.0.0/0 → IGW",
        "ออกได้เฉพาะ HTTPS",
        "ออกได้แต่ข้างนอกเข้ามาได้ด้วย",
      ],
      correct: 1,
      explain:
        "NAT Gateway ต้องอยู่ใน subnet ที่มี route ไป IGW (public subnet) ถึงจะส่งต่อออกอินเทอร์เน็ตได้ Elastic IP อย่างเดียวไม่พอ",
    },
  ],
  storage: [
    {
      q: "บริการไหนเหมาะกับการย้ายไฟล์/object จำนวนมากแบบรวดเร็ว อัตโนมัติ โดยไม่ตระหนัก schema?",
      options: [
        "AWS DMS",
        "AWS DataSync",
        "Storage Gateway (Tape)",
        "AWS Snowball Edge",
      ],
      correct: 1,
      explain:
        "DataSync ออกแบบมาเพื่อย้ายไฟล์/object จำนวนมากแบบเร็วและอัตโนมัติ ไม่สนใจ schema/transaction (ต่างจาก DMS ที่ตระหนัก schema)",
    },
    {
      q: "EBS volume type ไหนให้ราคาต่อ GB ถูกที่สุด เหมาะกับข้อมูลที่เข้าถึงไม่บ่อย?",
      options: [
        "Provisioned IOPS (io1/io2)",
        "General Purpose SSD (gp3)",
        "Magnetic (sc1)",
        "Instance Store",
      ],
      correct: 2,
      explain:
        "Magnetic (เดิมเรียก sc1 cold HDD) ให้ราคาต่อ GB ถูกที่สุด เหมาะกับงานที่เข้าถึงข้อมูลไม่บ่อย ส่วน Instance Store ไม่ใช่ EBS type เลย",
    },
    {
      q: "คุณสมบัติ Multi-Attach เป็นของ EBS volume type ไหน?",
      options: ["gp2 / gp3", "io1 / io2 (Provisioned IOPS)", "sc1 (Magnetic)", "st1"],
      correct: 1,
      explain:
        "Multi-Attach รองรับเฉพาะ Provisioned IOPS (io1/io2) เท่านั้น — gp3 ไม่รองรับ และ Multi-Attach คือการ attach volume เดียวกันให้หลาย EC2 ใน AZ เดียวกัน ไม่ใช่ multi-AZ",
    },
  ],
  "storage-services": [
    {
      q: "ไฟล์ที่สร้างใหม่ได้ง่ายต้องเก็บบน S3 โดยไม่กังวลเรื่องความจุ เดือนแรกเข้าถึงบ่อย หลังจากนั้นไม่บ่อยและเฉพาะ developer ใช้ ไม่มีข้อกำหนดเวลาดึง แต่ไฟล์ใน prefix tdojo-finance ใช้ประมวลผลต่อและต้องดึงระดับมิลลิวินาที วิธีใดคุ้มค่าที่สุด?",
      options: [
        "หลัง 1 เดือน เปลี่ยน storage class ของทั้ง bucket เป็น S3 Intelligent-Tiering ด้วย lifecycle policy",
        "หลัง 1 เดือน เปลี่ยน prefix tdojo-finance เป็น Standard-IA ส่วนที่เหลือไป Glacier ด้วย lifecycle policy",
        "หลัง 1 เดือน เปลี่ยนทั้ง bucket เป็น Standard-IA ด้วย lifecycle policy",
        "หลัง 1 เดือน เปลี่ยน prefix tdojo-finance เป็น One Zone-IA ส่วนที่เหลือไป Glacier ด้วย lifecycle policy",
      ],
      correct: 3,
      explain:
        "ไฟล์ทำซ้ำได้ง่าย จึงใช้ One Zone-IA (ถูกกว่า Standard-IA) กับ prefix ที่ต้องดึงระดับ ms ส่วนไฟล์ที่ไม่มีข้อกำหนดเวลาดึงส่งไป Glacier ซึ่งถูกกว่า ตั้ง lifecycle rule แยกตาม prefix ได้ ส่วน Standard-IA แพงกว่าโดยไม่จำเป็น",
    },
    {
      q: "ข้อใดเหมาะกับ S3 One Zone-IA มากที่สุด?",
      options: [
        "ข้อมูลทางการเงินชุดเดียวที่ห้ามหายและต้องทนต่อ AZ ล่ม",
        "Thumbnail ที่สร้างใหม่จากรูปต้นฉบับได้ เข้าถึงไม่บ่อยแต่ต้องดึงเร็ว",
        "ข้อมูล archive ที่เก็บ 10 ปีเพื่อ compliance",
        "ไฟล์ที่เข้าถึงทุกวัน",
      ],
      correct: 1,
      explain:
        "One Zone-IA เก็บ AZ เดียว ถูกกว่า Standard-IA เหมาะกับข้อมูลที่สร้างซ้ำได้หรือเป็นสำเนารอง ไม่เหมาะกับข้อมูลสำคัญที่ห้ามหาย (ใช้ Standard-IA) หรือ archive ระยะยาว (ใช้ Glacier) หรือข้อมูลที่เข้าถึงบ่อย (ใช้ Standard)",
    },
    {
      q: "ต้องการให้ EC2 (Linux) หลายสิบเครื่องอ่าน/เขียนไฟล์ชุดเดียวกันพร้อมกัน ควรเลือกบริการไหน?",
      options: ["Amazon EBS", "Amazon EFS", "Amazon S3 Glacier", "EC2 Instance Store"],
      correct: 1,
      explain:
        "EFS เป็น managed NFS ที่ mount ได้พร้อมกันจากหลาย EC2 (Linux) ส่วน EBS ผูกกับ AZ เดียวและ attach ได้ทีละตัว (ยกเว้น io1/io2 Multi-Attach ที่จำกัดใน AZ เดียว)",
    },
    {
      q: "บริษัทต้องย้าย Windows file server ที่ใช้ SMB และ Active Directory ขึ้น AWS ควรใช้อะไร?",
      options: [
        "Amazon EFS",
        "Amazon FSx for Lustre",
        "Amazon FSx for Windows File Server",
        "Amazon S3 + Transfer Acceleration",
      ],
      correct: 2,
      explain:
        "FSx for Windows File Server รองรับ SMB, NTFS และเชื่อม Active Directory ได้โดยตรง ส่วน EFS รองรับเฉพาะ Linux (NFS) และ Lustre ออกแบบมาสำหรับ HPC/ML",
    },
    {
      q: "งาน HPC / machine learning ต้องการ throughput สูงมากและอ่านข้อมูลตั้งต้นจาก S3 โดยตรง ควรเลือกอะไร?",
      options: [
        "Amazon FSx for Lustre",
        "Amazon FSx for Windows File Server",
        "Amazon EBS gp3",
        "Amazon EFS One Zone",
      ],
      correct: 0,
      explain:
        "FSx for Lustre ออกแบบสำหรับ HPC/ML ที่ต้อง throughput/IOPS สูง latency ต่ำ และเชื่อมกับ S3 ได้ (โหลดข้อมูลจาก bucket และเขียนผลกลับ)",
    },
    {
      q: "ต้องการเก็บข้อมูล compliance ระยะยาวหลายปีด้วยต้นทุนต่ำที่สุด และรอดึงข้อมูลได้เป็นชั่วโมง ควรใช้ S3 class ไหน?",
      options: [
        "S3 Standard-IA",
        "S3 One Zone-IA",
        "S3 Glacier Instant Retrieval",
        "S3 Glacier Deep Archive",
      ],
      correct: 3,
      explain:
        "Glacier Deep Archive ถูกที่สุดสำหรับ archive ระยะยาว (เก็บขั้นต่ำ 180 วัน ดึงข้อมูลภายในราว 12 ชั่วโมง) ส่วน Instant Retrieval แพงกว่าเพราะดึงได้เป็นมิลลิวินาที",
    },
    {
      q: "ข้อใดเป็นเงื่อนไขที่ต้องมีก่อนเปิด S3 Replication (CRR/SRR)?",
      options: [
        "ต้องเปิด Versioning ทั้ง bucket ต้นทางและปลายทาง",
        "ต้องใช้ storage class เป็น Glacier เท่านั้น",
        "bucket ต้นทางและปลายทางต้องอยู่ account เดียวกัน",
        "ต้องปิด encryption ของ bucket",
      ],
      correct: 0,
      explain:
        "S3 Replication ต้องเปิด Versioning ทั้งสอง bucket (และ replicate เฉพาะ object ใหม่หลังเปิด — ของเก่าใช้ S3 Batch Replication) ข้าม account ได้",
    },
    {
      q: "ต้องการให้ object ใน S3 ห้ามลบหรือแก้ไขได้แม้แต่ root user จนกว่าจะครบกำหนด (เพื่อ compliance) ควรใช้อะไร?",
      options: [
        "Versioning อย่างเดียว",
        "Bucket Policy แบบ Deny",
        "S3 Object Lock แบบ Compliance mode",
        "MFA Delete อย่างเดียว",
      ],
      correct: 2,
      explain:
        "Object Lock (WORM) แบบ Compliance mode ไม่ให้ใครลบ/แก้ได้แม้ root จนกว่าจะครบ retention ส่วน Governance mode ผู้มีสิทธิ์พิเศษยังข้ามได้",
    },
    {
      q: "EBS volume type ไหนที่ใช้เป็น boot volume ของ EC2 ไม่ได้?",
      options: ["gp3", "gp2", "io2", "st1 (Throughput Optimized HDD)"],
      correct: 3,
      explain:
        "Boot volume ต้องเป็น SSD (gp2/gp3/io1/io2) — HDD อย่าง st1 และ sc1 ใช้เป็น boot volume ไม่ได้ เหมาะกับข้อมูลแบบ throughput สูง/เข้าถึงไม่บ่อยเท่านั้น",
    },
    {
      q: "นักพัฒนาต้องการให้ข้อมูลของเว็บแอปคงอยู่ถาวรด้วย EBS แต่ไม่แน่ใจว่าต้องใช้ volume type ไหน ข้อใดเป็นจริงเกี่ยวกับ Amazon EBS volume types และการใช้งาน?",
      options: [
        "Magnetic volumes ราคาต่อ GB ถูกที่สุดของ EBS เหมาะกับข้อมูลที่เข้าถึงไม่บ่อยและงานที่ต้องการต้นทุน storage ต่ำสุด",
        "Provisioned IOPS volumes ให้ performance สม่ำเสมอ latency ต่ำ ออกแบบสำหรับงาน I/O หนัก เช่น relational หรือ NoSQL database ขนาดใหญ่",
        "General Purpose SSD (gp3) ที่เปิด multi-attach ให้ performance สม่ำเสมอและออกแบบมาสำหรับแอปที่ต้องการ multi-AZ resiliency",
        "Spot volumes ให้ราคาต่อ GB ถูกที่สุดของ EBS และเหมาะกับงานที่เข้าถึงข้อมูลไม่บ่อย",
        "Single root I/O virtualization (SR-IOV) volumes เหมาะกับงานหลากหลาย รวมถึง database ขนาดเล็ก-กลาง, dev/test และ boot volume",
      ],
      correct: [0, 1],
      explain:
        "ข้อ Magnetic และ Provisioned IOPS ถูกต้อง ส่วน gp3 ไม่รองรับ Multi-Attach (เป็นของ io1/io2 และจำกัดใน AZ เดียวไม่ใช่ multi-AZ), \"Spot volume\" ไม่ใช่ EBS type (Spot คือ EC2 pricing) และ SR-IOV คือ enhanced networking ไม่ใช่ EBS volume",
    },
    {
      q: "บริษัทตั้ง S3 Object Lock แบบ Governance mode ไว้ แอดมินคนหนึ่งต้องลบ object ก่อนครบ retention เขาต้องมีอะไร?",
      options: [
        "ไม่ต้องมีอะไร Governance mode ใครก็ลบได้",
        "สิทธิ์ s3:BypassGovernanceRetention และส่ง header ขอ bypass ตอนลบ",
        "ต้องรอครบ retention เท่านั้น ไม่มีวิธีอื่น",
        "ต้องปิด Versioning ของ bucket ก่อน",
      ],
      correct: 1,
      explain:
        "Governance mode ผู้ใช้ทั่วไปลบไม่ได้ แต่ผู้ที่มี s3:BypassGovernanceRetention และส่ง x-amz-bypass-governance-retention:true ข้ามได้ ส่วน Compliance mode ไม่มีใครข้ามได้ แม้ root",
    },
    {
      q: "ทีมกฎหมายต้องการล็อก object ห้ามลบ โดยยังไม่ทราบว่าจะปลดล็อกเมื่อไหร่ (ขึ้นกับคดีความ) ควรใช้ฟีเจอร์ใด?",
      options: [
        "Retention period แบบ Compliance mode 7 ปี",
        "S3 Object Lock — Legal hold",
        "S3 Lifecycle expiration",
        "MFA Delete",
      ],
      correct: 1,
      explain:
        "Legal hold ล็อกแบบไม่มีวันหมดอายุจนกว่าผู้มีสิทธิ์ (s3:PutObjectLegalHold) จะถอด และเป็นอิสระจาก retention mode ส่วน Retention period ต้องกำหนดช่วงเวลาตายตัว",
    },
    {
      q: "ต้องการบังคับ WORM ระดับ vault ของ S3 Glacier ด้วย policy ที่ไม่สามารถแก้ไขหรือลบได้อีกหลังยืนยัน ควรใช้อะไร?",
      options: [
        "S3 Bucket Policy แบบ Deny",
        "S3 Glacier Vault Lock",
        "IAM permission boundary",
        "AWS Config rule",
      ],
      correct: 1,
      explain:
        "Vault Lock ล็อก vault access policy ของ S3 Glacier เมื่อยืนยันแล้วแก้ไขหรือลบ policy ไม่ได้ (มีช่วงทดสอบ 24 ชม. ก่อนยืนยัน) เหมาะกับข้อกำหนด compliance",
    },
    {
      q: "แอปต้องให้ลูกค้าที่ไม่มี AWS account ดาวน์โหลดรายงาน PDF ส่วนตัวจาก S3 bucket ที่เป็น private ได้ชั่วคราวโดยไม่เปิด bucket เป็น public ควรทำอย่างไร?",
      options: [
        "เปิด Block Public Access แล้วตั้ง bucket policy เป็น public",
        "สร้าง S3 Pre-signed URL ที่มีเวลาหมดอายุ",
        "สร้าง IAM user ให้ลูกค้าทุกคน",
        "ใช้ S3 Transfer Acceleration",
      ],
      correct: 1,
      explain:
        "Pre-signed URL ให้สิทธิ์ชั่วคราวกับ object เฉพาะไฟล์ โดย bucket ยัง private และผู้รับไม่ต้องมี AWS credential สิทธิ์ที่ได้คือสิทธิ์ของผู้ที่ sign",
    },
    {
      q: "แอปสร้าง Pre-signed URL ด้วย IAM role (temporary credentials) ตั้งหมดอายุ 7 วัน แต่ session ของ role หมดใน 1 ชั่วโมง ลิงก์จะเป็นอย่างไร?",
      options: [
        "ใช้ได้ครบ 7 วัน",
        "หมดอายุเมื่อ temporary credential หมด (ราว 1 ชั่วโมง)",
        "ใช้ได้ตลอดไปจนกว่าจะลบ object",
        "ใช้ได้ 12 ชั่วโมงเสมอ",
      ],
      correct: 1,
      explain:
        "ลิงก์ที่ sign ด้วย temporary credential จะหมดอายุเมื่อ credential นั้นหมด แม้ตั้งไว้ยาวกว่า (IAM user ตั้งได้นานสุด 7 วัน)",
    },
    {
      q: "เว็บสตรีมวิดีโอแบบ HLS ที่แบ่งเป็นไฟล์ย่อยจำนวนมากหลัง CloudFront ต้องให้เฉพาะสมาชิกดูได้ และไม่อยากเปลี่ยน URL ของไฟล์ ควรใช้อะไร?",
      options: [
        "S3 Pre-signed URL ทีละไฟล์",
        "CloudFront Signed URL ทีละไฟล์",
        "CloudFront Signed Cookies",
        "Bucket policy แบบ public",
      ],
      correct: 2,
      explain:
        "Signed Cookies เหมาะเมื่อต้องให้สิทธิ์หลายไฟล์และไม่ต้องการเปลี่ยน URL ส่วน Signed URL ใช้ทีละไฟล์ หรือกับ client ที่ไม่รองรับ cookie",
    },
    {
      q: "ข้อใดถูกต้องเกี่ยวกับการให้สิทธิ์ผ่าน CloudFront Signed URL / Signed Cookies? (Select TWO)",
      options: [
        "Signed URL ให้สิทธิ์ได้ทีละ 1 ไฟล์ต่อ 1 URL",
        "Signed Cookies ให้สิทธิ์หลายไฟล์ได้โดยไม่ต้องเปลี่ยน URL",
        "ทั้งสองแบบเป็นของ S3 และใช้ได้โดยไม่ต้องมี CloudFront",
        "ทั้งสองแบบกำหนดวันหมดอายุไม่ได้",
      ],
      correct: [0, 1],
      explain:
        "Signed URL = ทีละไฟล์, Signed Cookies = หลายไฟล์ไม่เปลี่ยน URL ทั้งคู่เป็นฟีเจอร์ของ CloudFront (ไม่ใช่ S3 pre-signed) และกำหนดวันหมดอายุ/IP range (custom policy) ได้",
    },
    {
      q: "ต้องการให้ผู้ใช้เข้าถึงไฟล์ใน S3 ผ่าน CloudFront เท่านั้น ห้ามเข้า S3 URL ตรงๆ ควรตั้งค่าอย่างไร?",
      options: [
        "ใช้ Origin Access Control (OAC) และตั้ง bucket policy ให้รับเฉพาะ CloudFront",
        "เปิด bucket เป็น public แล้วซ่อน URL",
        "ใช้ NACL บล็อก IP ผู้ใช้",
        "ใช้ S3 Replication",
      ],
      correct: 0,
      explain:
        "OAC (แทน OAI แบบเก่า) ทำให้ S3 ยอมรับ request จาก CloudFront เท่านั้น เมื่อใช้ร่วมกับ Signed URL/Cookies ผู้ใช้จะต้องผ่าน CloudFront และยืนยันสิทธิ์ก่อนถึงไฟล์",
    },
  ],
  database: [
    {
      q: "RDS Performance Insights ใช้งานได้ตอนไหน?",
      options: [
        "เฉพาะตอน snapshot อยู่",
        "เฉพาะตอน instance กำลัง running อยู่",
        "ได้ตลอดแม้ terminate ไปแล้ว",
        "เฉพาะ Aurora เท่านั้น",
      ],
      correct: 1,
      explain:
        "Performance Insights เป็นฟีเจอร์ของ instance ที่ยัง running อยู่เท่านั้น ถ้า terminate ไปแล้วจะไม่มีข้อมูลนี้ให้ดู ต้อง restore จาก snapshot ก่อนถึงจะใช้ได้อีกครั้ง",
    },
    {
      q: "ข้อใดอธิบายความต่างระหว่าง DynamoDB Global Table กับ Global Secondary Index (GSI) ได้ถูกต้อง?",
      options: [
        "Global Table ใช้สำหรับ index เพิ่มเติมใน region เดียวกัน",
        "GSI ใช้สำหรับ replicate ข้าม region",
        "Global Table replicate ข้าม region ส่วน GSI อยู่ใน region เดียวกัน",
        "ทั้งสองแบบทำงานเหมือนกันทุกประการ",
      ],
      correct: 2,
      explain:
        "Global Table คือฟีเจอร์ multi-region replication ใช้สำหรับ DR ส่วน GSI เป็นแค่ index เพิ่มเติมภายใน region เดียวกัน ไม่เกี่ยวกับ DR เลย",
    },
    {
      q: "Solutions Architect ออกแบบฐานข้อมูล Amazon RDS for MySQL ที่ต้อง failover ไปยัง instance สำรองอัตโนมัติเมื่อเกิดความล้มเหลว และต้อง highly available ที่สุด ควรทำอย่างไร?",
      options: [
        "สร้าง standby replica ใน Availability Zone อื่นโดยเปิด Multi-AZ deployment",
        "สร้าง read replica ใน Region เดียวกันและต่าง Region แล้ว promote replica เมื่อ AZ ล่ม",
        "สร้าง cross-region read replica 5 ตัวในแต่ละ Region แล้ว promote เมื่อ AZ ล่ม",
        "สร้าง read replica 5 ตัวข้าม AZ แล้ว promote เมื่อ AZ ล่ม",
      ],
      correct: 0,
      explain:
        "Multi-AZ มี standby แบบ synchronous และ failover อัตโนมัติ ส่วนตัวเลือกอื่นต้อง promote read replica เอง (ไม่ใช่ automatic failover) และ replication เป็นแบบ asynchronous",
    },
    {
      q: "ข้อใดเป็นความแตกต่างที่ถูกต้องระหว่าง RDS Multi-AZ (แบบ instance) กับ Read Replica?",
      options: [
        "Multi-AZ ใช้ scale การอ่าน ส่วน Read Replica ใช้ failover อัตโนมัติ",
        "Multi-AZ replicate แบบ synchronous เพื่อ HA ส่วน Read Replica replicate แบบ asynchronous เพื่อ scale การอ่าน",
        "Multi-AZ ข้าม Region ได้ แต่ Read Replica ข้าม Region ไม่ได้",
        "ทั้งสองแบบ failover อัตโนมัติเหมือนกัน",
      ],
      correct: 1,
      explain:
        "Multi-AZ = synchronous + failover อัตโนมัติ (Region เดียว) | Read Replica = asynchronous รับ SELECT ได้และข้าม Region ได้ แต่ต้อง promote เอง",
    },
    {
      q: "บริการใดบ้างที่ข้ามหลาย Availability Zone ให้อัตโนมัติโดยไม่ต้องตั้งค่า standby เอง?",
      options: [
        "Amazon DynamoDB",
        "Amazon S3 (Standard)",
        "Amazon EC2 instance เดี่ยว",
        "NAT Gateway ตัวเดียว",
      ],
      correct: [0, 1],
      explain:
        "DynamoDB และ S3 Standard กระจายข้อมูลข้าม AZ ให้เองอยู่แล้ว ส่วน EC2 เดี่ยวและ NAT Gateway อยู่ AZ เดียว ต้องออกแบบกระจายเอง",
    },
    {
      q: "แอปต้องการฐานข้อมูล NoSQL แบบ key-value ที่ latency ระดับ single-digit millisecond รองรับ request หลักล้านต่อวินาที และไม่ต้องจัดการ server ควรเลือกอะไร?",
      options: ["Amazon RDS for MySQL", "Amazon DynamoDB", "Amazon Redshift", "Amazon Neptune"],
      correct: 1,
      explain: "DynamoDB เป็น serverless key-value/document NoSQL ที่ scale ได้มหาศาลและ latency ต่ำ ส่วน RDS เป็น relational, Redshift เป็น data warehouse, Neptune เป็น graph",
    },
    {
      q: "ต้องการ relational database ที่เข้ากันได้กับ MySQL/PostgreSQL แต่เร็วกว่า ทนทานกว่า และมี read replica ได้ถึง 15 ตัว โดยเป็น managed service ควรเลือกอะไร?",
      options: ["Amazon Aurora", "MySQL บน EC2", "Amazon DynamoDB", "Amazon ElastiCache"],
      correct: 0,
      explain: "Aurora เข้ากันได้กับ MySQL/PostgreSQL เก็บข้อมูล 6 copy ใน 3 AZ และมี Aurora Replica ได้สูงสุด 15 ตัว",
    },
    {
      q: "ต้องการวิเคราะห์ข้อมูลยอดขายหลาย TB ด้วย SQL ซับซ้อนและ join หลายตาราง (OLAP) ควรเลือกอะไร?",
      options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon ElastiCache"],
      correct: 2,
      explain: "Redshift คือ data warehouse แบบ columnar สำหรับ OLAP ส่วน RDS เหมาะกับ OLTP",
    },
    {
      q: "เว็บมีการอ่านข้อมูลเดิมซ้ำๆ จำนวนมากจนฐานข้อมูลช้า ต้องการลด latency ระดับ microsecond ด้วยการ cache ควรเลือกอะไร?",
      options: ["Amazon ElastiCache", "Amazon Redshift", "AWS DMS", "Amazon Neptune"],
      correct: 0,
      explain: "ElastiCache (Redis/Memcached) เป็น in-memory cache ที่วางหน้า database เพื่อลดภาระและ latency (DynamoDB ใช้ DAX)",
    },
    {
      q: "ต้องการ database สำหรับ social network ที่เน้นความสัมพันธ์ระหว่างข้อมูล เช่น friend-of-friend และระบบ recommendation ควรเลือกอะไร?",
      options: ["Amazon Neptune", "Amazon DocumentDB", "Amazon RDS", "Amazon Keyspaces"],
      correct: 0,
      explain: "Neptune คือ graph database เหมาะกับข้อมูลที่เน้นความสัมพันธ์ ส่วน DocumentDB เป็น document (MongoDB-compatible) และ Keyspaces เป็น Cassandra-compatible",
    },
    {
      q: "ต้องการย้ายแอปที่ใช้ MongoDB ขึ้น AWS แบบ managed โดยแก้โค้ดน้อยที่สุด ควรเลือกอะไร?",
      options: ["Amazon DocumentDB", "Amazon DynamoDB", "Amazon Redshift", "Amazon Neptune"],
      correct: 0,
      explain: "DocumentDB เข้ากันได้กับ MongoDB API จึงย้ายได้โดยแก้โค้ดน้อย ส่วน DynamoDB ต้องเขียนใหม่ตาม API ของมัน",
    },
    {
      q: "Lambda จำนวนมากเชื่อมต่อ RDS แล้วเจอ error \"too many connections\" ควรแก้ด้วยอะไร?",
      options: ["Amazon RDS Proxy", "เพิ่ม Read Replica", "เปลี่ยนเป็น Redshift", "ใช้ Multi-AZ"],
      correct: 0,
      explain: "RDS Proxy ทำ connection pooling ลดจำนวน connection ที่เปิดตรงไปยังฐานข้อมูล ส่วน Multi-AZ ช่วยเรื่อง HA ไม่ใช่เรื่อง connection",
    },
    {
      q: "ต้องการฐานข้อมูลที่ workload ใช้เป็นช่วงๆ คาดเดาปริมาณไม่ได้ และอยากลดค่าใช้จ่ายช่วงที่ไม่มีการใช้งาน ตัวเลือกใดเหมาะสม? (เลือก 2 ข้อ)",
      options: ["Aurora Serverless v2", "DynamoDB On-Demand", "RDS Multi-AZ ขนาดใหญ่ที่เปิดตลอด", "Redshift provisioned cluster ขนาดใหญ่"],
      correct: [0, 1],
      explain: "Aurora Serverless v2 และ DynamoDB On-Demand ปรับความจุตามการใช้งานจริง ส่วนอีกสองตัวต้องจ่ายตามขนาดที่จองไว้",
    },
    {
      q: "ย้ายฐานข้อมูล Oracle on-premises ไปเป็น Aurora PostgreSQL (คนละ engine) ต้องใช้เครื่องมือใดคู่กัน?",
      options: [
        "AWS SCT แปลง schema + AWS DMS ย้ายข้อมูล",
        "DMS อย่างเดียวพอ",
        "AWS Snowball Edge",
        "AWS DataSync",
      ],
      correct: 0,
      explain: "ย้ายข้าม engine ต้องแปลง schema/code ด้วย SCT แล้วย้ายข้อมูลด้วย DMS (ถ้า engine เดียวกัน DMS อย่างเดียวก็พอ)",
    },
  ],
  "compute-messaging": [
    {
      q: "บริษัทสร้างบริการ messaging รับข้อความหลักพันต่อวัน ทั้งหมดถูกประมวลผลโดย Amazon EMR cluster ต้องไม่มีข้อความหาย ไม่ซ้ำ และประมวลผลตามลำดับที่เข้ามา ควรเลือกอะไร?",
      options: [
        "Amazon Data Firehose",
        "Amazon Kinesis Data Stream",
        "SQS standard queue + dead-letter queue",
        "Amazon SNS Topic",
      ],
      correct: 1,
      explain:
        "Kinesis Data Streams เรียงลำดับตาม shard/partition key เก็บข้อมูลไว้ใน stream (ไม่หาย อ่านซ้ำได้) และ EMR อ่านได้โดยตรง ส่วน SQS standard ลำดับแบบ best-effort และส่งแบบ at-least-once (อาจซ้ำ), DLQ แค่เก็บข้อความที่ล้มเหลว, Firehose ส่งไปปลายทางสำเร็จรูป, SNS ไม่เก็บข้อความ",
    },
    {
      q: "ข้อใดถูกต้องเกี่ยวกับการเรียงลำดับของ Kinesis Data Streams?",
      options: [
        "เรียงลำดับทั้ง stream ไม่ว่ามีกี่ shard",
        "เรียงลำดับเฉพาะภายใน shard เดียวกัน และ record ที่ partition key เดียวกันจะเข้า shard เดียวกัน",
        "ไม่มีการรับประกันลำดับเลย",
        "เรียงลำดับตามเวลาที่ consumer อ่าน",
      ],
      correct: 1,
      explain:
        "ลำดับรับประกันต่อ shard — partition key เดียวกันถูก hash ไป shard เดียวกัน จึงเรียงตามลำดับที่เข้ามา ข้าม shard ไม่มีลำดับระหว่างกัน",
    },
    {
      q: "ต้องการส่งข้อมูล log แบบ near real-time เข้า S3 และ Redshift โดยไม่ต้องเขียน consumer เอง ควรใช้อะไร?",
      options: [
        "Kinesis Data Streams",
        "Amazon Data Firehose",
        "SQS FIFO",
        "SNS",
      ],
      correct: 1,
      explain:
        "Firehose เป็น managed delivery stream ส่งข้อมูลไปปลายทางอย่าง S3, Redshift, OpenSearch ให้อัตโนมัติ ไม่ต้องเขียน consumer (แต่ไม่ให้อ่านซ้ำย้อนหลังแบบ Data Streams)",
    },
    {
      q: "SQS Standard Queue มี delivery semantic แบบไหน?",
      options: [
        "Exactly-once เสมอ",
        "At-least-once (มีโอกาสซ้ำได้)",
        "At-most-once",
        "FIFO เท่านั้น",
      ],
      correct: 1,
      explain:
        "Standard Queue เป็น at-least-once — มีโอกาสได้ message ซ้ำเสมอ การปรับ visibility timeout ช่วยลดความเสี่ยงได้แต่ไม่กำจัดทิ้งได้หมด ต้องใช้ FIFO Queue ถ้าต้องการ exactly-once จริงๆ",
    },
    {
      q: "ข้อมูลใน Instance Store จะเป็นอย่างไรเมื่อ stop instance?",
      options: [
        "ยังอยู่เหมือนเดิม",
        "หายทันที",
        "ย้ายไป EBS ให้อัตโนมัติ",
        "สำรองไป S3 ให้อัตโนมัติ",
      ],
      correct: 1,
      explain:
        "Instance Store เป็น ephemeral storage ที่ผูกกับ host physical เดิม — ข้อมูลหายทันทีเมื่อ stop หรือ terminate instance (หรือ hardware ล้ม) ต่างจาก EBS ที่ persistent",
    },
    {
      q: "เมื่อมีออเดอร์ใหม่ ต้องส่งข้อความเดียวกันไปให้ระบบ inventory, shipping และ billing ประมวลผลพร้อมกันและอิสระต่อกัน ควรออกแบบอย่างไร?",
      options: [
        "ส่งเข้า SQS queue เดียว แล้วให้ทั้งสามระบบดึงจากคิวนั้น",
        "Publish ลง SNS topic แล้วให้แต่ละระบบมี SQS queue ของตัวเองที่ subscribe topic นั้น (fan-out)",
        "ส่งเข้า SQS FIFO queue เดียวพร้อมตั้ง visibility timeout สูงๆ",
        "ให้ผู้ส่งเรียก API ของทั้งสามระบบโดยตรงตามลำดับ",
      ],
      correct: 1,
      explain:
        "SQS คิวเดียว แต่ละข้อความจะถูก consumer ตัวเดียวหยิบไป ไม่ได้ถึงทุกระบบ ต้องใช้ SNS fan-out: SNS ส่งสำเนาไปทุก SQS queue ที่ subscribe ทำให้ loosely coupled และแต่ละระบบ retry/ประมวลผลอิสระกัน",
    },
    {
      q: "ต้องการลดจำนวน ReceiveMessage ที่ได้ผลว่างเปล่า (empty response) และลดค่าใช้จ่ายของ SQS ควรทำอย่างไร?",
      options: [
        "ใช้ Short polling ถี่ขึ้น",
        "เปิด Long polling (ตั้ง ReceiveMessageWaitTimeSeconds)",
        "ลด retention period ของคิว",
        "เปลี่ยนเป็น Delay queue",
      ],
      correct: 1,
      explain:
        "Long polling ให้ consumer รอจนมีข้อความ (สูงสุด 20 วินาที) ลดจำนวน request ว่างเปล่า ลดค่าใช้จ่ายและ latency เมื่อเทียบกับ short polling",
    },
    {
      q: "มีข้อความบางตัวที่ประมวลผลล้มเหลวซ้ำๆ จนวนกลับมาในคิวไม่จบ (poison message) ควรใช้อะไรจัดการ?",
      options: [
        "เพิ่ม visibility timeout ให้ยาวที่สุด",
        "ตั้ง Dead-Letter Queue พร้อม maxReceiveCount",
        "เปลี่ยนเป็น SNS topic",
        "ปิดการใช้งาน long polling",
      ],
      correct: 1,
      explain:
        "Dead-Letter Queue เก็บข้อความที่ล้มเหลวเกินจำนวนครั้งที่กำหนด (maxReceiveCount) ไว้ตรวจสอบ ไม่ให้วนซ้ำไม่จบและไม่บล็อกข้อความอื่น",
    },
    {
      q: "ระบบ worker บน EC2 Auto Scaling Group ต้อง scale ตามจำนวนงานที่ค้างในคิว SQS ควรใช้ metric ใดเป็นหลัก?",
      options: [
        "CPUUtilization ของ SQS",
        "ApproximateNumberOfMessagesVisible (จำนวนข้อความค้าง ต่อ instance)",
        "NumberOfEmptyReceives",
        "SentMessageSize",
      ],
      correct: 1,
      explain:
        "จำนวนข้อความค้างในคิว (ApproximateNumberOfMessagesVisible เมื่อเทียบเป็น backlog per instance) สะท้อนปริมาณงานที่รอ จึงใช้ scale worker ได้ตรงกว่า metric อื่น",
    },
    {
      q: "ต้องส่ง payload ที่ใหญ่กว่า 256 KB ผ่าน SQS ควรทำอย่างไร?",
      options: [
        "เพิ่ม message size limit ใน console",
        "ใช้ SQS Extended Client Library เก็บ payload ใน S3 แล้วส่ง pointer ในข้อความ",
        "เปลี่ยนไปใช้ SNS เพราะไม่จำกัดขนาด",
        "แบ่งไฟล์เป็น delay queue หลายใบ",
      ],
      correct: 1,
      explain:
        "ข้อความ SQS ใหญ่สุด 256 KB — งานที่ใหญ่กว่านั้นใช้ Extended Client Library เก็บ payload ใน S3 แล้วส่งเฉพาะ pointer (SNS ก็จำกัด 256 KB เช่นกัน)",
    },
    {
      q: "ข้อใดเป็นจริงเกี่ยวกับ Amazon SNS?",
      options: [
        "เป็นโมเดล publish/subscribe แบบ push ที่ส่งข้อความไปทุก subscriber ของ topic",
        "Subscriber ได้หลายแบบ เช่น SQS, Lambda, HTTP/S, Email, SMS",
        "เป็นโมเดล pull และเก็บข้อความไว้ 14 วันให้ consumer มาดึง",
        "ส่งข้อความได้เฉพาะไปยัง SQS queue เท่านั้น",
      ],
      correct: [0, 1],
      explain:
        "SNS เป็น pub/sub แบบ push: publish ลง topic แล้วส่งต่อทุก subscriber (SQS, Lambda, HTTP/S, Email, SMS, Mobile push, Firehose) ส่วนโมเดล pull ที่เก็บข้อความไว้ให้ดึงคือ SQS ไม่ใช่ SNS",
    },
  ],
  iam: [
    {
      q: "ข้อใด ไม่ใช่ สิ่งที่ AWS STS รับเป็น input โดยตรง?",
      options: [
        "SAML 2.0 assertion",
        "OIDC token",
        "Caller ที่ authenticated แล้ว (มี IAM credential)",
        "LDAP protocol (bind/search)",
      ],
      correct: 3,
      explain:
        "STS รับได้แค่ SAML assertion, OIDC token หรือ caller ที่มี IAM credential อยู่แล้วเท่านั้น — ไม่รู้จัก LDAP protocol โดยตรงเลย ต้องมี custom identity broker เป็นตัวกลาง",
    },
    {
      q: "เมื่อ identity store (เช่น LDAP) ไม่รองรับ SAML ควรใช้วิธีไหนเชื่อมกับ AWS?",
      options: [
        "ใช้ IAM Identity Center เชื่อมตรงกับ LDAP",
        "สร้าง Custom Identity Broker Application",
        "ใช้ Cognito User Pool แทน",
        "ใช้ Route 53 Resolver",
      ],
      correct: 1,
      explain:
        "ถ้า identity store ไม่รองรับ SAML/OIDC ต้องสร้าง Custom Identity Broker ที่คุยกับ LDAP ด้วย LDAP protocol แล้วไปเรียก STS ด้วย credential ของ broker เอง",
    },
    {
      q: "ข้อใดถูกต้องเกี่ยวกับ IAM Group?",
      options: [
        "มี credential ชั่วคราวของตัวเอง เหมือน Role",
        "ใช้ AssumeRole ได้เหมือน Role",
        "เป็นแค่ตัวจัดกลุ่ม IAM User เพื่อ attach policy ร่วมกัน",
        "ต้อง sync กับ LDAP เสมอ",
      ],
      correct: 2,
      explain:
        'IAM Group ไม่มี credential และ assume ไม่ได้ — เป็นแค่ "ตะกร้า" รวม IAM User หลายคนเพื่อ attach Policy ครั้งเดียวให้ทุกคนในกลุ่ม',
    },
    {
      q: "ผู้ใช้ login ผ่าน Google (OIDC) ในแอปมือถือ และต้องได้ credential ชั่วคราวเพื่อเข้าถึง AWS โดยที่ยังไม่มี AWS credential ควรใช้ STS API ใด?",
      options: [
        "AssumeRole",
        "AssumeRoleWithSAML",
        "AssumeRoleWithWebIdentity",
        "GetSessionToken",
      ],
      correct: 2,
      explain:
        "AssumeRoleWithWebIdentity รับ OIDC token จาก IdP (Google, Facebook, Amazon, Cognito) โดยผู้เรียกไม่ต้องมี AWS credential ส่วน AssumeRole ต้องมี credential อยู่แล้ว และ WithSAML ใช้กับ SAML assertion",
    },
    {
      q: "พนักงานยืนยันตัวตนผ่าน AD FS แล้วได้ SAML assertion ต้องเรียก STS API ใดเพื่อขอ credential ชั่วคราว?",
      options: [
        "GetFederationToken",
        "AssumeRoleWithSAML",
        "GetCallerIdentity",
        "DecodeAuthorizationMessage",
      ],
      correct: 1,
      explain:
        "AssumeRoleWithSAML รับ SAML 2.0 assertion จาก IdP แลกเป็น credential ชั่วคราวของ Role โดยผู้เรียกไม่ต้องมี AWS credential",
    },
    {
      q: "Custom identity broker ที่ถือ IAM user credential ของตัวเอง ต้องการขอ credential ชั่วคราวให้ผู้ใช้ภายนอกที่ผ่านการยืนยันตัวตนจาก LDAP แล้ว ใช้ STS API ใดได้?",
      options: [
        "GetFederationToken",
        "AssumeRoleWithSAML",
        "GetCallerIdentity",
        "DecodeAuthorizationMessage",
      ],
      correct: 0,
      explain:
        "Broker เรียกด้วย long-term credential ของตัวเองผ่าน GetFederationToken (หรือ AssumeRole) เพื่อขอ credential ชั่วคราวแทนผู้ใช้ภายนอกที่ไม่มี IAM user",
    },
    {
      q: "ต้องการให้ IAM user ยืนยัน MFA ก่อนเรียก API ที่อ่อนไหว โดยขอ credential ชั่วคราวพร้อม MFA ควรใช้ STS API ใด?",
      options: [
        "GetSessionToken",
        "AssumeRoleWithWebIdentity",
        "GetCallerIdentity",
        "DecodeAuthorizationMessage",
      ],
      correct: 0,
      explain:
        "GetSessionToken ออกให้ IAM user/root ที่มี long-term credential และรับ MFA code ได้ จึงใช้ขอ credential ชั่วคราวที่ผ่าน MFA เพื่อเรียก API ที่บังคับ MFA",
    },
    {
      q: "ต้องการตรวจว่า credential ที่ใช้อยู่ตอนนี้เป็นของ account ID และ ARN ใด (whoami) ใช้ STS API ใด?",
      options: [
        "GetSessionToken",
        "AssumeRole",
        "GetCallerIdentity",
        "DecodeAuthorizationMessage",
      ],
      correct: 2,
      explain:
        "GetCallerIdentity คืนค่า account ID, ARN และ user ID ของผู้เรียก โดยไม่ต้องมีสิทธิ์พิเศษ",
    },
    {
      q: "ข้อใดเป็นจริงเกี่ยวกับการใช้ STS AssumeRole ข้าม account?",
      options: [
        "Credential ที่ได้ประกอบด้วย Access Key ID, Secret Access Key และ Session Token ซึ่งหมดอายุเอง",
        "Trust policy ของ Role ต้องอนุญาต principal ที่มาขอสวม และ principal ต้องมีสิทธิ์ sts:AssumeRole",
        "Credential ที่ได้เป็นแบบถาวรไม่หมดอายุ",
        "ต้องมี SAML assertion เสมอถึงเรียกได้",
      ],
      correct: [0, 1],
      explain:
        "AssumeRole ให้ credential ชั่วคราว (key + secret + session token) และต้องผ่านสองด้าน: trust policy ของ Role อนุญาต principal และ principal มีสิทธิ์ sts:AssumeRole ส่วน SAML assertion ใช้กับ AssumeRoleWithSAML เท่านั้น",
    },
    {
      q: "ธนาคารพบว่ามีไฟล์ใน S3 ที่อัปโหลดโดยไม่เข้ารหัส AES-256 ต้องการ key rotate อัตโนมัติทุกปี และห้ามอัปโหลดไฟล์ไม่เข้ารหัสอีก โดยมี operational overhead น้อยที่สุด ควรทำอย่างไร?",
      options: [
        "Bucket policy Deny การอัปโหลดที่ไม่มี header AES256 + ใช้ SSE-S3 ที่ AWS rotate key ให้เอง",
        "สร้าง KMS customer managed key แล้ว rotate เองด้วยมือทุกปี",
        "ใช้ SCP ผูกกับ bucket เดียวเพื่อบังคับ header",
        "เปิด S3 Object Lock แบบ Compliance mode เพื่อ rotate key",
      ],
      correct: 0,
      explain:
        "SSE-S3 ใช้ AES-256 และ AWS จัดการ/rotate key ให้โดยเราไม่ต้องทำอะไร ส่วน Bucket policy Deny ทำให้ไฟล์ไม่เข้ารหัสอัปโหลดไม่ได้อีก การ rotate เองคือ overhead สูง, SCP ผูกกับ bucket เดียวไม่ได้ และ Object Lock ไม่เกี่ยวกับการเข้ารหัส",
    },
    {
      q: "ต้องการใช้ SSE-KMS แบบ customer managed key และให้ key rotate เองทุกปีโดยไม่ต้องทำด้วยมือ ต้องทำอย่างไร?",
      options: [
        "ไม่ต้องทำอะไร KMS rotate ให้เองเสมอ",
        "เปิด automatic key rotation ของ key นั้น",
        "Import key material เข้ามาแล้วเปิด automatic rotation",
        "เปลี่ยนไปใช้ SSE-C",
      ],
      correct: 1,
      explain:
        "Customer managed key ต้องติ๊กเปิด automatic rotation เอง (AWS managed key ถึงจะ rotate ให้เองโดยไม่ต้องตั้ง) ส่วน key ที่ import material มาเปิด automatic rotation ไม่ได้ ต้อง rotate เอง",
    },
    {
      q: "ต้องการบังคับให้ EBS volume ทุกลูกใน Region ถูกเข้ารหัสเสมอ ด้วยวิธีที่ง่ายที่สุด ควรทำอย่างไร?",
      options: [
        "เปิด EBS encryption by default ระดับ Region",
        "เขียน Lambda ตรวจแล้วลบ volume ที่ไม่เข้ารหัสทุกชั่วโมง",
        "ใช้ S3 bucket policy",
        "ใช้ Security Group",
      ],
      correct: 0,
      explain:
        "EBS encryption by default เปิดได้ระดับ Region ทำให้ volume ใหม่เข้ารหัสทุกลูก ส่วน SCP/IAM Deny ด้วย ec2:Encrypted ก็ใช้บังคับได้เช่นกัน",
    },
  ],
  management: [
    {
      q: "ทีมนักพัฒนาใช้ IAM user access key ทีม security ต้องการ deactivate และลบ key ที่อายุเกิน 90 วันโดยอัตโนมัติ ด้วยความพยายามในการดูแลน้อยที่สุด ควรทำอย่างไร?",
      options: [
        "สร้าง EventBridge rule กรอง key อายุเกิน 90 วัน แล้วตั้ง AWS Batch job รันทุก 24 ชม. เพื่อลบ",
        "สร้าง custom AWS Config rule ตรวจ max-age แล้วใช้ EventBridge Scheduler เรียก AWS Batch job ทุก 24 ชม. เพื่อลบ key ที่ไม่ผ่าน",
        "สร้าง EventBridge rule กรอง key อายุเกิน 90 วัน แล้วกำหนด target เป็น Lambda เพื่อ deactivate และลบ key",
        "ใช้ AWS Config managed rule ตรวจว่า key ไม่ได้ rotate ภายใน 90 วัน สร้าง EventBridge rule สำหรับ key ที่ non-compliant และกำหนด target เป็น Lambda ที่ deactivate และลบ key",
      ],
      correct: 3,
      explain:
        "ใช้ Config managed rule (access-keys-rotated) ตรวจอายุ key โดยไม่ต้องเขียนโค้ดตรวจเอง แล้วให้ EventBridge จับ event non-compliant เรียก Lambda ลบ key ส่วนตัวเลือกที่ใช้ EventBridge กรองอายุ key เองทำไม่ได้ (ไม่มี event บอกอายุ) และ custom rule + Batch เพิ่มภาระดูแลเกินจำเป็น",
    },
    {
      q: "AWS Config managed rule ที่ตรวจอายุของ IAM access key (access-keys-rotated) ทำงานเมื่อไหร่?",
      options: [
        "ทุกครั้งที่มีการเรียก API ของ IAM",
        "ตามรอบเวลาที่ตั้ง (periodic) เพราะอายุ key เพิ่มตามเวลา ไม่ได้มีการเปลี่ยนแปลงค่าตั้ง",
        "เฉพาะตอนสร้าง access key ใหม่",
        "IAM ส่ง event ให้เมื่อ key ครบ 90 วันโดยอัตโนมัติ",
      ],
      correct: 1,
      explain:
        "เงื่อนไขที่ขึ้นกับเวลา/อายุใช้ Config rule แบบ periodic (ตั้งความถี่ เช่น ทุก 24 ชม.) ส่วน IAM access key ไม่มีวันหมดอายุในตัวและไม่ได้ส่ง event เมื่อครบอายุ Config ประเมินแล้วส่ง event เมื่อสถานะ compliance เปลี่ยน",
    },
    {
      q: "ในรูปแบบ AWS Config → EventBridge → Lambda เพื่อจัดการ compliance แต่ละบริการทำหน้าที่ใด?",
      options: [
        "Config ตัดสินว่าผ่านหรือไม่, EventBridge ส่งต่อเหตุการณ์, Lambda ลงมือแก้ไข",
        "Config ลบ resource, EventBridge ตรวจอายุ, Lambda ส่งต่อเหตุการณ์",
        "EventBridge ตัดสินว่าผ่านหรือไม่, Config ลงมือแก้ไข, Lambda ส่งต่อเหตุการณ์",
        "Lambda ตรวจ compliance, Config ส่งต่อเหตุการณ์, EventBridge ลบ resource",
      ],
      correct: 0,
      explain:
        "Config = ผู้ประเมิน compliance, EventBridge = ผู้ส่งต่อเหตุการณ์ (กรอง NON_COMPLIANT), Lambda = ผู้ลงมือแก้ไข (remediation)",
    },
    {
      q: "เครื่องมือไหนใช้วิเคราะห์ CloudWatch Logs ด้วยภาษา query คล้าย SQL?",
      options: ["CloudWatch Logs Insights", "AWS Inspector", "SSM Agent", "AWS Config"],
      correct: 0,
      explain:
        "CloudWatch Logs Insights คือเครื่องมือ query log ด้วยภาษาคล้าย SQL ส่วน Inspector คือ security scanning และ SSM Agent คือ remote management — คนละจุดประสงค์กัน",
    },
    {
      q: "ข้อใดคือประโยชน์หลักของ AWS CloudFormation?",
      options: [
        "เก็บไฟล์ขนาดใหญ่ในราคาถูก",
        "Model, provision และ version-control infrastructure ทั้งหมดในไฟล์ text เดียว",
        "ทุก resource ที่สร้างผ่าน CFN ฟรีไม่มีค่าใช้จ่าย",
        "แทนที่ IAM ได้ทั้งหมด",
      ],
      correct: 1,
      explain:
        "CFN คือ Infrastructure as Code — เขียน template (YAML/JSON) เพื่อ model/provision/version-control infra ทั้งหมดแบบ declarative",
    },
    {
      q: "ผู้จัดการสงสัยว่า AWS CloudFormation ช่วยอะไรกับแพลตฟอร์มที่ใช้ AWS อยู่ ข้อใดเป็นประโยชน์ของ CloudFormation?",
      options: [
        "ช่วย model, provision และ version-control infrastructure ทั้งหมดบน AWS",
        "ช่วยให้ model infrastructure ทั้งหมดในไฟล์ text (template) ได้",
        "เป็นบริการเก็บ source code ของแอปพลิเคชัน",
        "เป็นบริการ object storage สำหรับเก็บไฟล์ขนาดใหญ่",
        "ทุก resource ที่สร้างผ่าน CloudFormation ใช้ฟรี",
      ],
      correct: [0, 1],
      explain:
        "CloudFormation คือ Infrastructure as Code: เขียน template (YAML/JSON) แล้ว provision/จัดการ/เก็บเวอร์ชัน infra ได้ ไม่ใช่ที่เก็บโค้ดหรือ object storage (นั่นคือ CodeCommit/S3) และตัว CFN ไม่คิดค่าบริการแต่ resource ที่สร้างขึ้นคิดเงินตามปกติ",
    },
  ],
  dr: [
    {
      q: "บริษัทใช้ Amazon Redshift cluster เป็น data warehouse ต้องวางแผน DR ให้ธุรกิจต่อเนื่องได้แม้ทั้ง AWS region ล่ม วิธีใดดีที่สุด?",
      options: [
        "ไม่ต้องทำอะไร เพราะ Redshift เป็น fully-managed และทน outage ของทั้ง region ได้",
        "เปิด Cross-Region Snapshot Copy ใน Redshift cluster",
        "สร้าง scheduled job ถ่าย snapshot ของ cluster ไปเก็บใน S3 แล้ว restore เมื่อ region ล่ม",
        "ใช้ Automated snapshots ของ Redshift cluster",
      ],
      correct: 1,
      explain:
        "Cross-Region Snapshot Copy คัดลอก snapshot ไป region อื่นให้อัตโนมัติ แล้ว restore ที่ region ปลายทางได้ ส่วน Automated snapshots อยู่ region เดียวกับ cluster, scheduled job ต้องสร้างและดูแลเองและไม่ได้ระบุว่าข้าม region, และ Redshift cluster ไม่ทน region outage ในตัว",
    },
    {
      q: "จับคู่บริการกับวิธี DR ข้าม region ที่ถูกต้อง (Select TWO)",
      options: [
        "S3 → Cross-Region Replication (ต้องเปิด Versioning)",
        "DynamoDB → Global Tables",
        "Redshift → Multi-AZ เพียงอย่างเดียวก็รอด region ล่ม",
        "Automated snapshots ของ RDS อยู่ข้าม region โดยอัตโนมัติเสมอ",
      ],
      correct: [0, 1],
      explain:
        "S3 ใช้ CRR (ต้องเปิด Versioning ทั้งสอง bucket) และ DynamoDB ใช้ Global Tables ส่วน Multi-AZ กันได้แค่ AZ ล่ม ไม่ใช่ region ล่ม และ snapshot ปกติอยู่ region เดิมจนกว่าจะตั้งคัดลอกข้าม region",
    },
    {
      q: "บริการไหนใช้สำหรับ DR แบบ replicate ข้าม region ใน DynamoDB?",
      options: ["Global Secondary Index (GSI)", "Local Secondary Index (LSI)", "Global Table", "DAX"],
      correct: 2,
      explain:
        "Global Table คือฟีเจอร์ multi-region replication ที่ใช้สำหรับ DR จริงๆ ส่วน GSI/LSI อยู่ใน region เดียวกัน ไม่เกี่ยวกับ DR",
    },
    {
      q: "เครื่องมือไหนให้ architectural review เทียบกับ AWS best practices โดยตรง?",
      options: [
        "AWS Compute Optimizer",
        "AWS Well-Architected Tool",
        "Amazon Managed Grafana",
        "Amazon CloudWatch",
      ],
      correct: 1,
      explain:
        "Well-Architected Tool ออกแบบมาเพื่อ review สถาปัตยกรรมเทียบกับ best practices โดยตรง ส่วน Compute Optimizer ทำแค่ rightsizing และ Grafana/CloudWatch ทำแค่ metrics/dashboard",
    },
  ],
  "high-availability": [
    {
      q: "ASG กระจาย instance ใน 2 AZ: AZ-a มี 3 เครื่อง, AZ-b มี 2 เครื่อง ใช้ Default termination policy เมื่อ scale-in ลด 1 เครื่อง ระบบจะเลือกอย่างไร?",
      options: [
        "terminate เครื่องที่เก่าที่สุดของ ASG ไม่ว่าอยู่ AZ ไหน",
        "เลือก AZ-a (มีเครื่องมากสุด) แล้วเลือกเครื่องที่ใช้ launch template/config เก่าสุดใน AZ นั้น",
        "เลือกเครื่องที่ใหม่สุดของ ASG",
        "สุ่มเลือกจากทุกเครื่อง",
      ],
      correct: 1,
      explain:
        "Default policy เลือก AZ ที่มี instance มากที่สุดก่อน (รักษาสมดุล AZ) จากนั้นใน AZ นั้นดู launch template/config เก่าสุด แล้วค่อยดูความใกล้รอบ billing และสุ่มเป็นตัวสุดท้าย",
    },
    {
      q: "ต้องการให้ ASG ทยอย terminate เครื่องที่ launch นานที่สุดก่อนเสมอ เพื่อเปลี่ยนเครื่องเก่า ควรตั้ง termination policy ใด?",
      options: ["NewestInstance", "OldestInstance", "ClosestToNextInstanceHour", "Default"],
      correct: 1,
      explain:
        "OldestInstance terminate เครื่องที่ launch นานที่สุดก่อน ส่วน Default จะดู AZ ที่มีเครื่องมากสุดก่อน จึงไม่รับประกันว่าเครื่องเก่าสุดถูกลบก่อน",
    },
    {
      q: "เปิด EC2 termination protection (DisableApiTermination) บน instance ใน ASG แล้ว ASG scale-in จะ terminate instance นี้ได้หรือไม่?",
      options: [
        "ไม่ได้ เพราะ termination protection กัน ASG ด้วย",
        "ได้ เพราะ termination protection ไม่กัน Auto Scaling ต้องใช้ Scale-in protection แทน",
        "ได้เฉพาะตอน health check ล้มเหลว",
        "ไม่ได้ จนกว่าจะ stop instance ก่อน",
      ],
      correct: 1,
      explain:
        "Termination protection กัน terminate ผ่าน API/Console เท่านั้น ไม่กัน ASG scale-in — ต้องเปิด Scale-in protection ของ ASG เพื่อกันไม่ให้ instance ถูกเลือกตอน scale-in",
    },
    {
      q: "ต้องการให้ instance ส่ง log ออกไป S3 ให้เสร็จก่อนถูก terminate โดย Auto Scaling ควรใช้อะไร?",
      options: [
        "Scale-in protection",
        "Lifecycle hook (Terminating:Wait)",
        "Termination protection",
        "Instance Store",
      ],
      correct: 1,
      explain:
        "Lifecycle hook ที่ Terminating:Wait หยุด instance ไว้ชั่วคราวให้ทำ cleanup/ดึง log ได้ก่อน แล้วค่อยปล่อยให้ terminate ต่อ",
    },
    {
      q: "ระบบที่ทำงานต่อได้โดยไม่สะดุดเลยแม้ component ล้ม (เป้าหมาย zero downtime) คือแนวคิดใด?",
      options: [
        "High Availability (อาจมีช่วง failover สั้นๆ)",
        "Fault Tolerance",
        "Scalability",
        "Elasticity",
      ],
      correct: 1,
      explain:
        "Fault Tolerance คือทำงานต่อได้ต่อเนื่องแม้ส่วนประกอบล้ม (ต้องมี capacity สำรองเกินพอ ต้นทุนสูงกว่า) ส่วน High Availability ยอมให้มีช่วง failover สั้นๆ ได้",
    },
    {
      q: "ข้อใดถูกต้องเกี่ยวกับ RDS Multi-AZ (instance deployment แบบมาตรฐาน)?",
      options: [
        "Standby อ่านได้ ช่วยกระจายภาระอ่าน",
        "Replicate แบบ synchronous ไป standby ต่าง AZ และ failover อัตโนมัติ",
        "ใช้ replicate ข้าม region เพื่อ DR",
        "Replicate แบบ asynchronous เพื่อเพิ่ม performance",
      ],
      correct: 1,
      explain:
        "Multi-AZ เน้น HA: replicate แบบ synchronous ไป standby ต่าง AZ แล้ว failover อัตโนมัติเมื่อมีปัญหา แต่ standby ไม่รับ read ส่วนการ scale read ใช้ Read Replica",
    },
    {
      q: "RDS แบบ read-heavy ต้องการเพิ่มกำลังอ่าน ควรใช้อะไร?",
      options: ["Multi-AZ standby", "Read Replica", "Snapshot", "Elastic IP"],
      correct: 1,
      explain:
        "Read Replica replicate แบบ asynchronous และอ่านได้ จึงใช้กระจายภาระอ่าน (ข้าม region ได้ด้วย) ส่วน Multi-AZ standby ใช้สำรองเพื่อ failover เท่านั้น",
    },
    {
      q: "Amazon Aurora เก็บข้อมูลกี่ copy ข้ามกี่ AZ?",
      options: [
        "2 copies ใน 2 AZ",
        "3 copies ใน 1 AZ",
        "6 copies ข้าม 3 AZ",
        "4 copies ข้าม 2 AZ",
      ],
      correct: 2,
      explain:
        "Aurora storage เก็บข้อมูล 6 copies ข้าม 3 AZ ทำให้ทนต่อการสูญเสียหลาย copy ได้โดยยังเขียน/อ่านต่อได้",
    },
    {
      q: "ต้องการให้ Auto Scaling Group เปลี่ยน instance ที่ตัวแอปไม่ตอบสนอง (แม้ EC2 status check ยังผ่าน) ต้องตั้งค่าอะไร?",
      options: [
        "เปิด ELB health check บน Auto Scaling Group",
        "เพิ่มขนาด instance type",
        "ผูก Elastic IP ให้ทุก instance",
        "ใช้ Instance Store แทน EBS",
      ],
      correct: 0,
      explain:
        "ค่าเริ่มต้น ASG ดูแค่ EC2 status check — ต้องเปิด ELB health check เพื่อให้ ASG ทดแทน instance ที่ไม่ผ่านการเช็คของ load balancer ด้วย",
    },
    {
      q: "ต้องการสลับ traffic ไป region สำรองอัตโนมัติเมื่อ primary ไม่ healthy ควรใช้อะไร?",
      options: [
        "Route 53 Failover routing + Health Check",
        "Route 53 Simple routing",
        "Route 53 Geolocation routing โดยไม่มี health check",
        "S3 Cross-Region Replication",
      ],
      correct: 0,
      explain:
        "Route 53 Failover routing ผูกกับ Health Check จะสลับไป secondary อัตโนมัติเมื่อ primary ไม่ healthy ส่วน Simple routing ไม่มีการเช็ค health",
    },
    {
      q: "ต้องการ RTO ต่ำมากโดยรันระบบเต็มกำลังหลาย region พร้อมกัน ควรใช้ DR strategy ไหน?",
      options: [
        "Backup and Restore",
        "Pilot Light",
        "Warm Standby",
        "Multi-Site Active/Active",
      ],
      correct: 3,
      explain:
        "Multi-Site Active/Active รันเต็มกำลังหลาย region พร้อมกัน จึง RTO/RPO ต่ำที่สุด (แต่ต้นทุนสูงสุด) ส่วน Warm Standby รันขนาดย่อก่อนแล้วค่อยขยาย",
    },
    {
      q: "แอปต้องมี EC2 instance ทำงานอย่างน้อย 6 ตัวตลอดเวลา กระจายใน 3 AZ ข้อใดให้ fault tolerance 100% แม้ AZ ใด AZ หนึ่งล่ม?",
      options: [
        "AZ ละ 2 ตัว (2, 2, 2)",
        "AZ ละ 3 ตัว (3, 3, 3)",
        "6 ตัว, 6 ตัว, 0 ตัว (6, 6, 0)",
        "4 ตัว, 3 ตัว, 2 ตัว (4, 3, 2)",
      ],
      correct: [1, 2],
      explain:
        "ต้องเหลือ ≥ 6 ตัวแม้เสีย AZ ที่มีเครื่องมากที่สุด: (3,3,3) เหลือ 6 ✔, (6,6,0) เหลือ 6 ✔ (แต่ไม่ใช่ best practice เพราะไม่ใช้ AZ ที่สาม) ส่วน (2,2,2) เหลือ 4 ✘ และ (4,3,2) เหลือ 5 ✘ — \"ต้องการ 6\" คือขั้นต่ำ ไม่ใช่ผลรวมสูงสุด",
    },
  ],
  "high-performance": [
    {
      q: "แอปประมวลผล log ขนาดหลายร้อย GB แบบอ่านต่อเนื่อง (sequential) ต้องการ throughput สูงและต้นทุนต่ำ ควรใช้ EBS volume type ใด?",
      options: [
        "io2 Provisioned IOPS SSD",
        "io1 Provisioned IOPS SSD",
        "st1 Throughput Optimized HDD",
        "EC2 Instance Store เท่านั้น",
      ],
      correct: 2,
      explain:
        "งาน sequential / big data / log ต้องการ throughput มากกว่า IOPS → st1 (HDD ราคาถูก เน้น throughput) ส่วน io1/io2 แพงและเน้น IOPS เหมาะกับ random I/O",
    },
    {
      q: "ฐานข้อมูล OLTP รองรับผู้ใช้พร้อมกันจำนวนมาก แต่ละ transaction อ่าน/เขียนข้อมูลเพียงไม่กี่ KB ค่า metric ใดสำคัญที่สุดในการเลือก storage?",
      options: [
        "Throughput (MB/s) เป็นหลัก",
        "IOPS และ latency",
        "ขนาด volume รวมเท่านั้น",
        "ความเร็วเครือข่ายอย่างเดียว",
      ],
      correct: 1,
      explain:
        "คำขอเล็กๆ จำนวนมากทำให้คอขวดคือ IOPS (และ latency) ถ้า IOPS ไม่พอ คำขอจะต่อคิวและช้า แม้ throughput ยังเหลือ",
    },
    {
      q: "ข้อใดเป็นจริงเกี่ยวกับ IOPS และ Throughput? (Select TWO)",
      options: [
        "IOPS นับจำนวนครั้งที่อ่าน/เขียนต่อวินาที ส่วน Throughput นับปริมาณข้อมูลต่อวินาที",
        "Throughput ≈ IOPS × ขนาด I/O ต่อครั้ง",
        "IOPS สูงเสมอหมายถึง throughput สูงเสมอ ไม่ว่าขนาด I/O เท่าใด",
        "st1 เหมาะกับงานที่ต้อง IOPS สูงแบบ random มากที่สุด",
      ],
      correct: [0, 1],
      explain:
        "IOPS นับจำนวนครั้ง, Throughput นับปริมาณข้อมูล และมีความสัมพันธ์ Throughput ≈ IOPS × ขนาด I/O (IOPS สูงแต่ I/O เล็กก็ได้ throughput ต่ำ) ส่วน st1 เน้น throughput แบบ sequential ไม่ใช่ random IOPS",
    },
    {
      q: "HPC cluster ใช้ EC2 ที่มี Provisioned IOPS (io1) volume ขนาด 10 GiB ต่อ volume เพื่องาน transaction-intensive ที่ต้อง latency ต่ำ ต้องคง IOPS สูงและ latency ต่ำโดยตั้ง queue length ที่เหมาะสม ควรตั้งค่าอย่างไร?",
      options: [
        "ตั้ง IOPS 400 และรักษา queue length ให้ต่ำ",
        "ตั้ง IOPS 500 และรักษา queue length ให้ต่ำ",
        "ตั้ง IOPS 800 และรักษา queue length ให้ต่ำ",
        "ตั้ง IOPS 600 และรักษา queue length ให้สูง",
      ],
      correct: 1,
      explain:
        "io1 ตั้ง IOPS ได้สูงสุด 50 IOPS ต่อ GiB → 10 GiB = 500 IOPS (800 และ 600 เกินเพดาน) ต้องการ IOPS สูงจึงตั้งเต็มเพดาน และ queue length ต่ำช่วยรักษา latency ต่ำ ส่วน high queue length ทำให้ latency เพิ่ม",
    },
    {
      q: "EBS io1 volume ขนาด 200 GiB ตั้ง Provisioned IOPS ได้สูงสุดเท่าไร?",
      options: ["3,000", "6,000", "10,000", "20,000"],
      correct: 2,
      explain:
        "io1 อัตราส่วนสูงสุด 50 IOPS ต่อ GiB → 200 × 50 = 10,000 IOPS",
    },
    {
      q: "ต้องการลด latency การอ่าน DynamoDB ให้เหลือระดับไมโครวินาที โดยแก้โค้ดน้อยที่สุด ควรใช้อะไร?",
      options: [
        "ElastiCache for Redis (ต้องเขียน logic แคชเอง)",
        "DynamoDB Accelerator (DAX)",
        "Amazon CloudFront",
        "RDS Read Replica",
      ],
      correct: 1,
      explain:
        "DAX เป็นแคชเฉพาะ DynamoDB ที่ API เข้ากันได้ อ่านระดับไมโครวินาที แก้โค้ดน้อยมาก ส่วน ElastiCache ต้องเขียน logic แคชเอง",
    },
    {
      q: "ต้องการ static anycast IP และเร่งทราฟฟิก TCP/UDP ผ่าน AWS backbone ไปยัง endpoint ที่ healthy ใกล้ที่สุด ควรใช้อะไร?",
      options: [
        "Amazon CloudFront",
        "AWS Global Accelerator",
        "Route 53 Latency routing",
        "S3 Transfer Acceleration",
      ],
      correct: 1,
      explain:
        "Global Accelerator ให้ static anycast IP 2 ตัว ไม่แคชเนื้อหา แต่เร่ง TCP/UDP และ failover ไป endpoint ที่ healthy ส่วน CloudFront เป็น CDN แคช HTTP/HTTPS",
    },
    {
      q: "งาน HPC ต้องการ latency ต่ำและ throughput สูงระหว่างโหนด ควรใช้ Placement Group แบบใด?",
      options: ["Cluster", "Spread", "Partition", "ไม่ต้องใช้ Placement Group"],
      correct: 0,
      explain:
        "Cluster placement group รวม instance ใกล้กันใน AZ เดียวเพื่อ latency ต่ำ/throughput สูง (แลกกับความเสี่ยงถ้า AZ มีปัญหา) ส่วน Spread เน้นแยกฮาร์ดแวร์เพื่อความทนทาน",
    },
    {
      q: "ElastiCache ตัวไหนรองรับ persistence, replication และ Multi-AZ failover?",
      options: ["Memcached", "Redis", "ทั้งสองแบบเหมือนกัน", "ไม่มีตัวไหนรองรับ"],
      correct: 1,
      explain:
        "Redis รองรับ persistence, replication และ Multi-AZ failover พร้อม data structure หลากหลาย ส่วน Memcached เรียบง่าย multi-thread แต่ไม่มี persistence",
    },
    {
      q: "S3 รองรับคำขอ GET/HEAD ได้ประมาณเท่าไหร่ต่อวินาทีต่อ prefix?",
      options: ["100", "1,000", "5,500", "50,000"],
      correct: 2,
      explain:
        "S3 รองรับประมาณ 5,500 GET/HEAD และ 3,500 PUT/COPY/POST/DELETE ต่อวินาทีต่อ prefix — กระจายข้อมูลหลาย prefix เพื่อให้ได้ throughput รวมสูงขึ้น",
    },
    {
      q: "ต้องการลด cold start ของ Lambda function ที่ latency-sensitive ควรใช้อะไร?",
      options: [
        "Provisioned Concurrency",
        "Reserved Concurrency",
        "เพิ่ม timeout",
        "ตั้ง Dead Letter Queue",
      ],
      correct: 0,
      explain:
        "Provisioned Concurrency อุ่น execution environment ไว้ล่วงหน้าเพื่อลด cold start ส่วน Reserved Concurrency เป็นแค่การจองเพดานการรันพร้อมกัน ไม่ได้อุ่นเครื่อง",
    },
  ],
  billing: [
    {
      q: "To save costs, your manager instructed you to analyze and review the setup of your AWS cloud infrastructure. In this scenario, which of the following will incur costs?",
      options: [
        "A stopped On-Demand EC2 Instance",
        "A running EC2 Instance",
        "Public Data Set",
        "EBS Volumes attached to stopped EC2 Instances",
        "Using an Amazon VPC",
      ],
      correct: [1, 3],
      explain:
        "Running EC2 คิดค่า compute และ EBS volume ที่ผูกกับ instance ที่ stop ยังคิดเงินตามขนาดที่จอง ส่วน stopped instance ไม่คิดค่า compute, Public Data Set ฟรี และ VPC ฟรี (แต่ NAT Gateway/VPN/Public IPv4 ที่เสียบเพิ่มคิดเงิน)",
    },
    {
      q: "EC2 instance ที่ถูก stop แล้ว ค่าใช้จ่ายส่วนใดยังเกิดขึ้นอยู่?",
      options: [
        "ค่า compute ของ instance",
        "ค่า EBS volume ที่ผูกอยู่ (ตามขนาดที่จอง)",
        "ไม่มีค่าใช้จ่ายเลย",
        "ค่า data transfer เข้าจากอินเทอร์เน็ต",
      ],
      correct: 1,
      explain:
        "Stop แล้วหยุดค่า compute แต่ EBS volume ยังกินพื้นที่และคิดเงินตามขนาดที่จอง (รวมถึง Elastic IP ที่ไม่ได้ใช้) ต้องลบ volume หรือ terminate ถึงจะหยุดจ่ายส่วนนี้",
    },
    {
      q: "บริษัทมี workload แบบ batch ที่ล้มกลางทางแล้วรันต่อได้ (fault-tolerant) ต้องการประหยัดสูงสุด ควรใช้ EC2 pricing แบบใด?",
      options: [
        "On-Demand Instances",
        "Reserved Instances 3 ปี",
        "Spot Instances",
        "Dedicated Hosts",
      ],
      correct: 2,
      explain:
        "Spot ถูกที่สุด (ลดได้สูงสุด ~90%) แต่ AWS ดึงคืนได้ จึงเหมาะกับงาน batch/stateless ที่หยุดแล้วทำต่อได้ ส่วน RI เหมาะกับงานต่อเนื่อง และ Dedicated Hosts เหมาะกับ license ผูกฮาร์ดแวร์",
    },
    {
      q: "ต้องการประเมินราคาสถาปัตยกรรมที่กำลังจะสร้าง (ก่อน deploy จริง) ควรใช้เครื่องมือใด?",
      options: [
        "AWS Cost Explorer",
        "AWS Pricing Calculator",
        "AWS Budgets",
        "AWS Cost and Usage Report",
      ],
      correct: 1,
      explain:
        "Pricing Calculator ใช้ประเมินราคาล่วงหน้า ส่วน Cost Explorer/CUR ดูค่าใช้จ่ายที่เกิดขึ้นแล้ว และ Budgets ใช้ตั้งงบและแจ้งเตือน",
    },
    {
      q: "ต้องการให้แจ้งเตือนเมื่อค่าใช้จ่ายเกินหรือคาดว่าจะเกินงบที่ตั้งไว้ ควรใช้อะไร?",
      options: [
        "AWS Budgets",
        "AWS Pricing Calculator",
        "AWS Trusted Advisor",
        "AWS Compute Optimizer",
      ],
      correct: 0,
      explain:
        "AWS Budgets ตั้งงบ (cost/usage/RI-Savings Plans coverage) และแจ้งเตือนหรือสั่ง action เมื่อเกินหรือคาดว่าจะเกิน",
    },
    {
      q: "ต้องการรายงานค่าใช้จ่ายและการใช้งานที่ละเอียดที่สุด เพื่อส่งเข้า S3 แล้ว query ต่อด้วย Athena ควรใช้อะไร?",
      options: [
        "Cost Explorer",
        "AWS Cost and Usage Report (CUR)",
        "AWS Budgets",
        "Cost Anomaly Detection",
      ],
      correct: 1,
      explain:
        "CUR เป็นรายงานละเอียดที่สุดของ AWS ส่งเข้า S3 ได้ และใช้ Athena/QuickSight วิเคราะห์ต่อได้ ส่วน Cost Explorer เหมาะกับการดูภาพรวมและกราฟ",
    },
    {
      q: "ข้อใดเป็นประโยชน์ของ Consolidated Billing ใน AWS Organizations?",
      options: [
        "ต้องจ่ายค่าบริการ Organizations เพิ่มต่อ account",
        "รวมบิลเป็นใบเดียวและรวมปริมาณการใช้งานเพื่อได้ volume discount รวมถึงแชร์ส่วนลด RI/Savings Plans",
        "ทำให้ทุก account ใช้ IAM user ร่วมกันได้",
        "ลบความจำเป็นต้องมี management account",
      ],
      correct: 1,
      explain:
        "Consolidated Billing ใช้ฟรี รวมบิลที่ management account รวมปริมาณใช้งานเพื่อได้ส่วนลดตามขั้น และแชร์ส่วนลดจาก RI/Savings Plans ข้าม account ได้",
    },
    {
      q: "ต้องการ support plan ที่ให้ Trusted Advisor ครบทุก check และติดต่อ support ได้ 24/7 สำหรับ production workload (ตามแผนแบบเดิมที่ข้อสอบใช้) ควรเลือกแผนใด?",
      options: ["Basic", "Developer", "Business", "ไม่มีแผนใดให้ได้"],
      correct: 2,
      explain:
        "Business ให้ Trusted Advisor ครบทุก check และ support 24/7 ผ่านโทรศัพท์/แชท/อีเมล สำหรับ production ส่วน Basic ฟรีแต่จำกัด และ Developer เป็นช่วงเวลาทำการ",
    },
  ],
  analytics: [
    {
      q: "บริการไหน query ข้อมูลบน S3 แบบ serverless, ad-hoc ด้วย SQL โดยไม่ต้องย้ายข้อมูล?",
      options: ["Amazon EMR", "Amazon Athena", "Kinesis Data Analytics", "Amazon QuickSight"],
      correct: 1,
      explain:
        "Athena คือ serverless query engine ที่ query ตรงบน S3 ด้วย SQL แบบ ad-hoc โดยไม่ต้องย้ายหรือโหลดข้อมูลไปที่ไหนก่อน",
    },
    {
      q: "ต้องการ ML forecasting แบบสำเร็จรูป ไม่อยาก train model เอง ควรใช้บริการไหน?",
      options: ["Amazon SageMaker", "Amazon Forecast", "Amazon EMR", "Amazon QuickSight"],
      correct: 1,
      explain:
        "Amazon Forecast เป็น ML forecasting สำเร็จรูป ไม่ต้อง custom train model เอง ต่างจาก SageMaker ที่ต้องสร้าง/ฝึก model เอง",
    },
    {
      q: "บริษัทมี Linux server บน EC2 หลายเครื่อง ทีม Audit ต้องการเก็บและประมวลผล application log เพื่อทำรายงาน ควรเลือกโซลูชันใด?",
      options: [
        "S3 Glacier Deep Archive เก็บ log และ AWS ParallelCluster ประมวลผล",
        "Amazon S3 เก็บ log และ Amazon EMR ประมวลผล",
        "S3 Glacier เก็บ log และ Spot EC2 ประมวลผล",
        "EC2 On-Demand เครื่องเดียวทั้งเก็บและประมวลผล",
      ],
      correct: 1,
      explain:
        "S3 เก็บ log ทนทานและเป็นแหล่งข้อมูลมาตรฐานของ analytics ส่วน EMR ประมวลผลข้อมูลก้อนใหญ่แบบกระจาย Glacier ดึงช้า, ParallelCluster เป็น HPC, และเครื่องเดียวเป็น single point of failure",
    },
    {
      q: "ต้องการรัน SQL query ข้อมูลใน S3 แบบ ad-hoc โดยไม่ต้องจัดการ cluster เลย ควรใช้บริการใด?",
      options: ["Amazon EMR", "Amazon Athena", "AWS ParallelCluster", "Amazon Redshift provisioned cluster"],
      correct: 1,
      explain:
        "Athena เป็น serverless query ตรงบน S3 ด้วย SQL ส่วน EMR ต้องมี cluster Hadoop/Spark และ ParallelCluster เป็น HPC",
    },
    {
      q: "งานใดเหมาะกับ Amazon EMR?",
      options: [
        "รัน Spark/Hadoop ประมวลผลข้อมูลหลาย TB",
        "ตั้ง landing zone หลาย account",
        "จัดการ HPC cluster สำหรับงานจำลองทางฟิสิกส์",
        "เก็บ object แบบ archive ระยะยาว",
      ],
      correct: 0,
      explain:
        "EMR คือ managed big data framework (Hadoop, Spark, Hive ฯลฯ) ส่วน landing zone คือ Control Tower, HPC คือ ParallelCluster และ archive คือ Glacier",
    },
  ],
  governance: [
    {
      q: "Service Control Policy (SCP) ใช้ทำอะไร?",
      options: [
        "สร้าง multi-account landing zone ให้อัตโนมัติ",
        "จำกัดเพดานสิทธิ์สูงสุดของทุก account ใน AWS Organizations",
        "จัดการ billing ขององค์กร",
        "เป็น IAM Role ชนิดพิเศษ",
      ],
      correct: 1,
      explain:
        "SCP คือ policy ที่กำหนดเพดานสิทธิ์สูงสุดของ account ใน Organizations แม้ root user ของ account นั้นก็ทำเกิน SCP ไม่ได้",
    },
    {
      q: "AWS Control Tower ต่างจาก SCP อย่างไร?",
      options: [
        "เป็นสิ่งเดียวกันทุกประการ",
        "Control Tower คือระบบจัดการ multi-account ที่ครอบ SCP + guardrail อื่นๆไว้อีกชั้น",
        "SCP ใช้แทน Control Tower ได้เสมอ",
        "Control Tower ใช้ได้กับแค่ account เดียวเท่านั้น",
      ],
      correct: 1,
      explain:
        "Control Tower คือบริการที่ตั้ง landing zone หลาย account ให้อัตโนมัติ (สร้าง OU, account, guardrail ซึ่งหลายตัวสร้างจาก SCP ให้) ส่วน SCP เป็นแค่เครื่องมือกำหนด guardrail ตัวหนึ่งเท่านั้น",
    },
  ],
  "resource-recap": [
    {
      q: "ต้องการ data warehouse แบบ columnar สำหรับรัน SQL วิเคราะห์ข้อมูลก้อนใหญ่ (petabyte) ควรเลือกบริการใด?",
      options: ["Amazon RDS", "Amazon Redshift", "Amazon DynamoDB", "Amazon ElastiCache"],
      correct: 1,
      explain: "Redshift คือ data warehouse (OLAP, columnar) ส่วน RDS เป็น OLTP, DynamoDB เป็น NoSQL key-value, ElastiCache เป็น cache",
    },
    {
      q: "ต้องการรัน SQL ถามข้อมูลที่อยู่ใน S3 โดยตรง แบบ serverless ไม่ต้องจัดการ server ควรใช้อะไร?",
      options: ["Amazon Athena", "Amazon EMR", "AWS Glue DataBrew", "Amazon QuickSight"],
      correct: 0,
      explain: "Athena query ไฟล์ใน S3 ด้วย SQL แบบ serverless จ่ายตามข้อมูลที่สแกน ส่วน EMR ต้องจัดการ cluster, QuickSight ใช้ทำ dashboard",
    },
    {
      q: "ต้องการ queue เพื่อแยกส่วน (decouple) ระหว่าง web tier กับ worker tier ให้ worker ดึงงานไปทำตามจังหวะตัวเอง ควรใช้อะไร?",
      options: ["Amazon SNS", "Amazon SQS", "Amazon Kinesis Data Firehose", "AWS Direct Connect"],
      correct: 1,
      explain: "SQS เป็น message queue แบบ pull ที่ใช้ decouple ส่วน SNS เป็น pub/sub แบบ push",
    },
    {
      q: "ต้องการให้ EC2 ใน private subnet ออกอินเทอร์เน็ตได้ แต่ข้างนอกเริ่ม connection เข้ามาไม่ได้ ควรใช้อะไร?",
      options: ["Internet Gateway ติดกับ private subnet", "NAT Gateway ใน public subnet", "VPC Peering", "Transit Gateway"],
      correct: 1,
      explain: "NAT Gateway วางใน public subnet (มี Elastic IP) แล้วให้ route table ของ private subnet ชี้ 0.0.0.0/0 มาที่ NAT",
    },
    {
      q: "ต้องการ block IP address เฉพาะเจาะจงที่โจมตีเข้ามา ระดับ subnet ควรใช้อะไร?",
      options: ["Security Group", "Network ACL", "IAM Policy", "Route 53"],
      correct: 1,
      explain: "NACL รองรับ Deny rule ส่วน Security Group มีแต่ Allow",
    },
    {
      q: "ต้องการเชื่อมต่อ on-premises กับ AWS ด้วยสายเฉพาะ (dedicated private connection) ไม่ผ่านอินเทอร์เน็ต ควรใช้อะไร?",
      options: ["Site-to-Site VPN", "AWS Direct Connect", "CloudFront", "Global Accelerator"],
      correct: 1,
      explain: "Direct Connect คือสายเช่าเฉพาะ ส่วน Site-to-Site VPN วิ่งผ่านอินเทอร์เน็ตแบบเข้ารหัส",
    },
    {
      q: "ต้องการจัดเก็บและหมุนเวียน (rotate) password ของ database อัตโนมัติ ควรใช้อะไร?",
      options: ["AWS Secrets Manager", "AWS KMS", "AWS Shield", "Amazon Inspector"],
      correct: 0,
      explain: "Secrets Manager เก็บ secret และ rotate อัตโนมัติได้ ส่วน KMS จัดการ encryption key",
    },
    {
      q: "ต้องการป้องกันการโจมตีแบบ SQL injection และ XSS ที่หน้า web application ควรใช้อะไร?",
      options: ["AWS WAF", "AWS Shield Standard", "Amazon GuardDuty", "AWS Config"],
      correct: 0,
      explain: "WAF กรอง HTTP request ระดับ Layer 7 (SQLi, XSS) ส่วน Shield ป้องกัน DDoS, GuardDuty ตรวจจับภัยคุกคาม",
    },
    {
      q: "ต้องการตรวจสอบว่า resource ใน account ตรงตามกฎ compliance หรือไม่ และเก็บประวัติการเปลี่ยนแปลง config ควรใช้อะไร?",
      options: ["AWS CloudTrail", "AWS Config", "Amazon CloudWatch", "AWS Trusted Advisor"],
      correct: 1,
      explain: "Config บันทึกสถานะ/ประวัติ configuration และประเมินตาม rule ส่วน CloudTrail บันทึก API call (ใครทำอะไร)",
    },
    {
      q: "ต้องการย้ายข้อมูลระดับหลายสิบ TB–PB จาก on-premises โดยเครือข่ายช้า ควรใช้อะไร?",
      options: ["AWS Snowball", "Amazon Route 53", "AWS Direct Connect เท่านั้น", "Amazon SES"],
      correct: 0,
      explain: "Snow Family คืออุปกรณ์ physical ส่งข้อมูลก้อนใหญ่เมื่อเครือข่ายช้าหรือแพง",
    },
    {
      q: "บริการใดบ้างที่เป็น serverless (ไม่ต้องจัดการ server เอง)?",
      options: ["AWS Lambda", "Amazon EC2", "Amazon DynamoDB", "Amazon Redshift provisioned cluster"],
      correct: [0, 2],
      explain: "Lambda และ DynamoDB เป็น serverless ส่วน EC2 และ Redshift provisioned ต้องเลือก/จัดการขนาด instance เอง",
    },
    {
      q: "บริการใดบ้างที่ใช้ทำ caching เพื่อลด latency?",
      options: ["Amazon ElastiCache", "Amazon CloudFront", "AWS CloudTrail", "AWS Organizations"],
      correct: [0, 1],
      explain: "ElastiCache cache ข้อมูลหน้า database ส่วน CloudFront cache เนื้อหาที่ edge location",
    },
  ],
  api: [
    {
      q: "API Gateway Edge-Optimized endpoint ต้องวาง ACM certificate ที่ region ไหน?",
      options: ["Region เดียวกับ API Gateway", "us-east-1 เสมอ", "eu-west-1 เสมอ", "ไม่ต้องใช้ certificate"],
      correct: 1,
      explain:
        "Edge-Optimized endpoint ไปผ่าน CloudFront ด้านหลัง ดังนั้น ACM certificate ต้องอยู่ที่ us-east-1 เท่านั้น ไม่ว่า API Gateway เองจะอยู่ region ไหนก็ตาม",
    },
    {
      q: "API Gateway Regional endpoint ต้องวาง ACM certificate ไว้ที่ไหน?",
      options: ["us-east-1 เสมอ", "Region เดียวกับ API Gateway นั้น", "ที่ไหนก็ได้ตามใจ", "ไม่รองรับ custom domain"],
      correct: 1,
      explain:
        "Regional endpoint ไม่ได้ผ่าน CloudFront ดังนั้น certificate ต้องอยู่ region เดียวกับตัว API Gateway เอง เช่น API อยู่ us-east-2 ก็ต้องมี cert ที่ us-east-2 ด้วย",
    },
  ],
};

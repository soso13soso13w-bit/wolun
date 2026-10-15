import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositorName, setDepositorName] = useState('');
  const [sajuForm, setSajuForm] = useState({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    birthTime: 'unknown', // 12지지 시간대
    question: ''
  });
  const [validationError, setValidationError] = useState('');
  const [paymentStep, setPaymentStep] = useState('checkout');
  const [readingResult, setReadingResult] = useState(null);
  
  // 개인 질문 상담 상태
  const [consultQuestion, setConsultQuestion] = useState('');
  const [consultResult, setConsultResult] = useState(null);

  // 운영자 실계좌 정보 (토스뱅크 1002-1526-1128 송시우)
  const myAccount = {
    bank: '토스뱅크',
    accountNumber: '1002-1526-1128',
    holder: '송시우'
  };

  // 상품 목록
  const products = [
    { id: 'today', name: '오늘의 일주(日柱) 운세', price: 0, desc: '오늘의 천간지지 기운과 일간의 생극 관계 분석', icon: '🌙', badge: '무료', isFree: true },
    { id: 'custom', name: '정통 사주팔자 8자 분석', price: 3900, desc: '연월일시 4주 8자 산출 및 오행·성향 심층 리포트', icon: '🌌', badge: '유료', isFree: false },
    { id: 'comprehensive', name: '십성·격국 정통 종합 사주', price: 9900, desc: '비겁·식상·재성·관성·인성 십성 분석 및 용신 정밀 진단', icon: '☯️', badge: '유료', isFree: false },
    { id: 'romance', name: '연애·인연 심층 궁합', price: 4900, desc: '연애 성향, 호감 표현 방식, 관계 발전 조언', icon: '💖', badge: '유료', isFree: false },
    { id: 'wealth', name: '재물·자산 관리 리딩', price: 4900, desc: '소비 습관, 재정 관리 방식 및 실천 가능한 재물 팁', icon: '💰', badge: '유료', isFree: false },
    { id: 'career', name: '직업운·진로 가이드', price: 4900, desc: '어울리는 업무 환경과 진로 선택에 대한 명리 조언', icon: '💼', badge: '유료', isFree: false },
    { id: 'ai', name: '명리 1:1 개인 질문 상담', price: 4900, desc: '고민에 맞춘 정통 사주학 기반 맞춤형 솔루션', icon: '🔮', badge: '유료', isFree: false },
  ];

  // 승인된 상품 ID 목록 (기존 localStorage의 'custom' 유료 승인 기록을 강제로 제외/초기화)
  const [approvedProducts, setApprovedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('wolun_approved');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 'custom' 상품을 강제로 삭제하여 승인 해제
        const cleaned = parsed.filter(id => id !== 'custom');
        localStorage.setItem('wolun_approved', JSON.stringify(cleaned));
        return cleaned;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wolun_approved', JSON.stringify(approvedProducts));
    } catch (e) {
      console.error(e);
    }
  }, [approvedProducts]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSajuForm(prev => ({ ...prev, [name]: value }));
  };

  // 정통 사주팔자 산출 및 전문 6단계 구조화 리포트 생성 엔진
  const handleSajuSubmit = (e) => {
    e.preventDefault();
    if (!sajuForm.name.trim()) {
      setValidationError('이름 또는 별칭을 입력해주세요.');
      return;
    }
    if (!sajuForm.birthDate) {
      setValidationError('생년월일을 입력해주세요.');
      return;
    }
    setValidationError('');
    
    const birth = new Date(sajuForm.birthDate);
    const y = birth.getFullYear();
    const m = birth.getMonth() + 1;
    const d = birth.getDate();

    const CHEONGAN = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];
    const CHEONGAN_ELEMENTS = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
    const JIJI = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];
    const JIJI_ELEMENTS = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

    const yearGanIdx = (y - 4) % 10 < 0 ? (y - 4) % 10 + 10 : (y - 4) % 10;
    const yearJiIdx = (y - 4) % 12 < 0 ? (y - 4) % 12 + 12 : (y - 4) % 12;
    const monthJiIdx = (m + 1) % 12;
    const monthGanIdx = ((yearGanIdx % 5) * 2 + m) % 10;
    const dayBase = Math.floor(y * 365.25) + Math.floor(m * 30.6) + d;
    const dayGanIdx = (dayBase + 9) % 10;
    const dayJiIdx = (dayBase + 1) % 12;

    const timeJiMap = {
      unknown: 0,
      ja: 0, chuk: 1, in: 2, myo: 3, jin: 4, sa: 5,
      o: 6, mi: 7, shin: 8, yu: 9, sul: 10, hae: 11
    };

    const selectedTimeJiIdx = timeJiMap[sajuForm.birthTime] !== undefined ? timeJiMap[sajuForm.birthTime] : 0;
    const timeGanIdx = ((dayGanIdx % 5) * 2 + selectedTimeJiIdx) % 10;

    const sajuPillar = {
      year: `${CHEONGAN[yearGanIdx]}${JIJI[yearJiIdx]}`,
      month: `${CHEONGAN[monthGanIdx]}${JIJI[monthJiIdx]}`,
      day: `${CHEONGAN[dayGanIdx]}${JIJI[dayJiIdx]}`,
      time: sajuForm.birthTime === 'unknown' ? '미상 (시간 미입력)' : `${CHEONGAN[timeGanIdx]}${JIJI[selectedTimeJiIdx]}`,
    };

    const dayMasterElement = CHEONGAN_ELEMENTS[dayGanIdx];
    const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    [yearGanIdx, monthGanIdx, dayGanIdx, timeGanIdx].forEach(idx => elementCounts[CHEONGAN_ELEMENTS[idx]]++);
    [yearJiIdx, monthJiIdx, dayJiIdx, selectedTimeJiIdx].forEach(idx => elementCounts[JIJI_ELEMENTS[idx]]++);

    const generateStructuredContent = (title, summary, detail, example, caution, positive, action) => ({
      title, summary, detail, example, caution, positive, action
    });

    setReadingResult({
      name: sajuForm.name,
      sajuPillar,
      dayMaster: `${CHEONGAN[dayGanIdx]} (${dayMasterElement}기운 일간 - 본원)`,
      elementCounts,
      personality: generateStructuredContent(
        "타고난 사주 원국 및 본질적 성향",
        `일간 ${CHEONGAN[dayGanIdx]}을 중심으로 ${dayMasterElement}의 기운이 조화롭게 발현되어 통찰력과 결단력을 겸비한 성품입니다.`,
        `사주 명리학에서 일간(日干)은 본인의 영혼과 근본 자아를 상징합니다. 원국 내 오행의 유기적인 소통으로 인해 타인의 감정을 빠르게 캐치하면서도, 내면의 주관과 원칙이 매우 확고한 구조를 지니고 있습니다. 위기 상황에서 냉철하게 판세를 읽고 실마리를 찾아내는 잠재력이 뛰어납니다.`,
        `조직이나 프로젝트에서 의견이 대립할 때, 감정적으로 치우치지 않고 객관적인 데이터를 바탕으로 해결책을 제시하여 신뢰를 얻는 모습으로 나타납니다.`,
        `완벽주의적 성향이 강해 스스로에게 지나친 기준을 부과하거나, 마음속 고민을 홀로 삭히며 에너지를 소모할 수 있으니 주의가 필요합니다.`,
        `특유의 분석력과 공감 지능을 결합하여 리더로서의 입지를 다지거나 전문 분야에서 독보적인 성취를 이루는 데 적극 활용하세요.`,
        `오늘 하루는 모든 것을 혼자 해결하려 하지 말고, 믿을 만한 사람과 생각을 공유하며 마음의 짐을 내려놓아 보세요.`
      ),
      romance: generateStructuredContent(
        "연애 성향 및 깊은 인연의 발전",
        "진정성 있는 정서적 교감을 최우선으로 여기며, 한 사람에게 깊고 오래 스며드는 해바라기형 연애 스타일입니다.",
        "명리적으로 재성(財星)과 관성(官星)의 조화 속에서 상대방을 향한 책임감과 배려가 깊게 작용합니다. 가벼운 만남보다는 서로의 가치관을 존중하고 정신적으로 성장을 도모할 수 있는 깊은 관계를 추구합니다. 표현이 서툴러도 행동과 진심으로 마음을 증명합니다.",
        "상대방이 지쳐있을 때 말없이 따뜻한 차를 건네거나, 세심하게 일정을 조율해 주는 등 묵묵한 내조와 헌신으로 감동을 주는 상황입니다.",
        "속마음을 오랫동안 표현하지 않고 혼자 참다가 한 번에 감정이 폭발하거나 거리를 둘 수 있으므로 정기적인 대화가 필수적입니다.",
        "진솔한 언어로 감정을 표현하는 습관을 들인다면, 파트너와 평생을 의지할 수 있는 단단한 유대 관계를 구축할 수 있습니다.",
        "오늘 연인이나 호감 가는 분에게 따뜻한 안부와 함께 고마운 마음을 솔직하게 표현해 보세요."
      ),
      wealth: generateStructuredContent(
        "재물운 및 실질적 자산 관리 방안",
        "철저한 계획성과 리스크 관리 능력을 바탕으로 재정을 안정적으로 증식해 나가는 십성 구조입니다.",
        "재성(財星)의 흐름이 견고하여 충동적인 소비나 투기성 자금 운용보다는, 장기적인 가치와 안정성을 중시합니다. 돈을 다루는 감각이 신중하며, 자산을 체계적으로 분산하여 관리하는 탁월한 본능을 지니고 있습니다.",
        "필요한 지출과 불필요한 소비를 냉정하게 구분하고, 할인 혜택이나 투자 포트폴리오를 꼼꼼히 비교하여 합리적으로 결정을 내리는 모습입니다.",
        "지나치게 보수적인 태도로 인해 다가온 좋은 기회를 망설이다가 놓치거나, 시기를 놓쳐 고민이 길어질 수 있습니다.",
        "안정적인 저축 기조를 유지하면서도, 시대 흐름에 맞는 유망한 자기계발이나 장기 자산 배분에 시야를 넓혀보세요.",
        "이번 달 고정 지출 항목을 세밀하게 점검하고, 소액이라도 미래를 위한 자동 저축 플랜을 재정비해 보세요."
      ),
      career: generateStructuredContent(
        "직업운, 적성 및 진로 발전 가이드",
        "책임감과 기획력이 뛰어나며, 전문적인 지식을 활용하는 분야나 독립적인 프로젝트에서 대성할 팔자입니다.",
        "관성(官星)과 식상(食傷)의 유기적인 협조로 인해 주어진 과제를 분석하고 창의적으로 해결하는 능력이 탁월합니다. 단순 반복 업무보다는 본인의 권한과 자율성이 보장되는 환경에서 폭발적인 업무 성과를 발휘합니다.",
        "복잡하게 얽힌 업무 프로세스를 도식화하고 핵심 문제점을 파악하여 팀 전체의 생산성을 극대화하는 상황입니다.",
        "지나치게 틀에 박히거나 관료적인 조직 문화, 소통이 단절된 환경에서는 극심한 정신적 피로감과 정체기를 겪을 수 있습니다.",
        "전문 자격증 취득, 기획·컨설팅, 기술 기반 비즈니스나 창의적 콘텐츠 제작 분야로 진로를 설정하면 큰 성공을 거둘 수 있습니다.",
        "현재 진행 중인 프로젝트나 학업에서 가장 핵심적인 우선순위 3가지를 선정하여 집중력을 발휘해 보세요."
      ),
      relationships: generateStructuredContent(
        "대인관계 및 지혜로운 소통 방법",
        "신용과 의리를 최우선으로 여기며, 주변 사람들에게 깊은 안정감과 신뢰를 주는 품격 있는 인상입니다.",
        "타인의 입장을 먼저 헤아리고 배려하는 덕성(德性)을 지니고 있어, 위기의 순간에 진가를 알아주는 귀인(貴人)과 든든한 동반자들이 자연스럽게 곁에 모이는 복을 지니고 있습니다.",
        "친구의 힘든 사정을 묵묵히 들어주며 현실적이면서도 가슴 따뜻한 해결책을 조언해 주는 든든한 멘토 역할입니다.",
        "주변의 부탁이나 거절하기 힘든 요구를 차마 뿌리치지 못해 혼자서 과도한 스트레스나 짐을 떠안는 경향이 있습니다.",
        "건강한 심리적 경계선을 설정하고, 자신의 의사를 부드럽고 단호하게 표현하는 커뮤니케이션 기술을 연마해 보세요.",
        "오랫동안 소원해졌던 고마운 지인이나 친구에게 가벼운 안부 메시지를 건네며 인연을 돈독히 해보세요."
      ),
      health: generateStructuredContent(
        "건강 유지 비결 및 신체 리듬 관리",
        "신체 에너지를 효율적으로 관리하기 위해 규칙적인 수면 습관과 스트레스 이완 루틴이 절대적으로 필요합니다.",
        "지속적인 두뇌 활동과 집중으로 인해 어깨, 목, 신경계에 긴장이 쉽게 누적될 수 있습니다. 오행의 균형을 맞추기 위해 자연과 가까이 지내며 심신을 정화하는 것이 명리적으로 매우 유리합니다.",
        "작업 중간에 일어나 가볍게 심호흡을 하거나, 퇴근길 가벼운 산책을 통해 머리를 비우고 활력을 충전하는 모습입니다.",
        "피로가 누적되었음에도 의지로만 버티며 휴식을 미루는 습관은 만성 피로를 유발할 수 있으므로 경계해야 합니다.",
        "충분한 수면과 가벼운 유산소 운동을 최고의 보약으로 여기고, 일과 휴식의 밸런스를 엄격하게 지키세요.",
        "오늘 저녁 취침 전에는 스마트폰 화면을 멀리하고 따뜻한 차와 함께 가벼운 스트레칭으로 숙면을 준비해 보세요."
      ),
      timing: generateStructuredContent(
        "시기별 운세 흐름 (오늘·이번 주·대운의 방향)",
        "과거의 노력이 결실을 맺고, 새로운 도약과 전환점을 맞이하는 매우 중요한 상승 국면입니다.",
        "현재 시기적 흐름은 내실을 단단히 다지는 동시에 외부로 확장할 수 있는 기운이 공존하고 있습니다. 조급하게 서두르기보다 때를 기다려 실리를 취하면 큰 성과를 거둘 수 있습니다.",
        "중요한 계약이나 결정을 앞두고 철저한 사전 조사와 검토를 거쳐 실수 없는 결과를 만들어내는 상황입니다.",
        "주위의 급작스러운 소문이나 타인의 의견에 흔들려 본래의 중심을 잃거나 갈피를 잡지 못하는 것을 주의하세요.",
        "자신만의 뚜렷한 호흡과 페이스를 유지하며 차근차근 전진한다면, 뜻하는 바를 온전히 이루어낼 수 있습니다.",
        "이번 주 세부적인 일정과 목표를 다시 한번 점검하고 마음의 여유와 평정을 유지하세요."
      )
    });

    setCurrentPage('result');
  };

  // 개인 질문 상담 응답 생성
  const handleConsultSubmit = (e) => {
    e.preventDefault();
    if (!consultQuestion.trim()) {
      alert('고민이나 질문을 입력해 주세요.');
      return;
    }

    const q = consultQuestion.trim();
    setConsultResult({
      question: q,
      answerDirect: `질문하신 "${q}"에 대해, 정통 명리 원국과 현재의 시운(時運)을 대조한 결과 지금은 변화를 두려워하기보다 내실을 다지고 주도권을 잡아야 할 시점입니다.`,
      situation: `제공해주신 고민의 맥락을 다각도로 진단해 볼 때, 외부의 불확실한 변수보다는 본인의 내면적인 확신과 구체적인 준비 상태가 성패를 가르는 결정적 요인입니다.`,
      sajuPerspective: `정통 명리학적 관점에서 현재 귀하의 일간과 십성 흐름은 과도기를 지나 새로운 기회 영역으로 진입하는 에너지를 강하게 내뿜고 있습니다.`,
      example: `마치 오랜 기간 준비해 온 무대나 시험을 앞두고 막바지 실력을 점검하듯, 세부적인 디테일을 보완하면 유리한 고지를 선점할 수 있습니다.`,
      actionSteps: [
        "1단계: 현재 겪고 있는 문제의 원인과 장단기 대안을 백지에 객관적으로 적어보세요.",
        "2단계: 타인의 시선이나 주변 압박에서 벗어나 본인이 가장 가치 있게 여기는 선택지에 집중하세요.",
        "3단계: 오늘 하루는 성급한 결정을 유보하고 마인드 컨트롤과 충분한 휴식으로 컨디션을 회복하세요."
      ],
      caution: `지나친 염려나 최악의 상황에 대한 가정은 불필요한 에너지 낭비를 초래하므로 긍정적인 마인드를 견지하세요.`,
      closing: `귀하께서는 이미 이 모든 상황을 지혜롭게 헤쳐나갈 타고난 지혜와 저력을 품고 계십니다. 진심으로 응원합니다.`
    });
  };

  // 상품 선택 가이드
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product.isFree) {
      setCurrentPage('input');
    } else if (approvedProducts.includes(product.id)) {
      if (!readingResult) {
        setCurrentPage('input');
      } else {
        setCurrentPage('paidResult');
      }
    } else {
      setPaymentStep('checkout');
      setCurrentPage('payment');
    }
  };

  // 입금 완료 신청 (승인 대기 상태로 진입)
  const handleConfirmDepositRequest = () => {
    if (!depositorName.trim()) {
      alert('실제 입금하신 분의 성함을 입력해 주세요.');
      return;
    }
    setPaymentStep('pending');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b132b', color: '#f8fafc', paddingBottom: '60px' }}>
      {/* 상단 내비게이션 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(11, 19, 43, 0.95)', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ background: 'none', border: 'none', color: '#fef3c7', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>☯️</span> 월운 (月運) — 정통 명리 & 상담
          </button>
          
          <nav style={{ display: 'flex', gap: '20px', fontSize: '15px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>홈</button>
            <button onClick={() => setCurrentPage('input')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>사주 분석</button>
            <button onClick={() => setCurrentPage('products')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>유료 상품</button>
            <button onClick={() => setCurrentPage('consult')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>개인 상담</button>
          </nav>

          <button 
            onClick={() => setCurrentPage('input')}
            style={{ padding: '10px 18px', background: 'linear-gradient(to right, #d97706, #f59e0b)', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
          >
            무료 사주 시작
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 1. 홈 화면 */}
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ textAlign: 'center', padding: '65px 20px', background: 'linear-gradient(to bottom, rgba(28, 37, 65, 0.6), transparent)', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                ✨ 만세력 기반 4주 8자 정통 명리학 & 1:1 심층 상담
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '20px', lineHeight: '1.3' }}>
                당신의 운명에 비치는 은은한 달빛,<br />월운(月運)에서 정밀하게 풀어냅니다
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '620px', margin: '0 auto 30px auto', lineHeight: '1.7', fontSize: '15px' }}>
                전통 사주 명리의 깊이와 구체적인 인생 지침을 담았습니다. 성향, 연애, 재물, 진로까지 체계적인 분석 리포트를 경험해 보세요.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setCurrentPage('input')}
                  style={{ padding: '16px 32px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)' }}
                >
                  무료 사주 분석하기 ➔
                </button>
                <button 
                  onClick={() => setCurrentPage('consult')}
                  style={{ padding: '16px 32px', backgroundColor: 'rgba(28, 37, 65, 0.8)', color: '#fef3c7', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' }}
                >
                  🔮 1:1 개인 질문 상담
                </button>
              </div>
            </div>

            {/* 상품 카드 목록 */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '8px', textAlign: 'center' }}>월운 추천 서비스</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>원하시는 분야를 선택하여 무통장 입금 신청 후 승인을 기다려주세요.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {products.map(p => {
                  const isApproved = approvedProducts.includes(p.id);
                  return (
                    <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '28px' }}>{p.icon}</span>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', backgroundColor: p.isFree ? 'rgba(74, 222, 128, 0.15)' : (isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)'), color: p.isFree ? '#4ade80' : (isApproved ? '#34d399' : '#fcd34d'), fontWeight: 'bold', border: '1px solid ' + (p.isFree ? 'rgba(74, 222, 128, 0.3)' : (isApproved ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.3)')) }}>
                            {p.isFree ? '무료' : (isApproved ? '승인됨' : '입금 대기')}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '8px' }}>{p.name}</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</p>
                      </div>
                      <div>
                        <div style={{ color: '#fcd34d', fontWeight: 'bold', marginBottom: '14px', fontSize: '15px' }}>
                          {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                        </div>
                        <button 
                          onClick={() => handleSelectProduct(p)}
                          style={{ width: '100%', padding: '12px', backgroundColor: p.isFree || isApproved ? '#0b132b' : '#f59e0b', color: p.isFree || isApproved ? '#f8fafc' : '#0f172a', border: '1px solid ' + (p.isFree || isApproved ? 'rgba(245, 158, 11, 0.3)' : 'transparent'), borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                          {p.isFree ? '바로 확인하기' : (isApproved ? '결과 보기 (승인완료)' : '💳 무통장 입금 신청')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. 유료 상품 리스트 페이지 */}
        {currentPage === 'products' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '10px', textAlign: 'center' }}>프리미엄 명리 분석 상품</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>무통장 입금 후 운영자의 승인 확인이 완료되어야 해당 상품을 이용하실 수 있습니다.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {products.map(p => {
                const isApproved = approvedProducts.includes(p.id);
                return (
                  <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{p.icon}</div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '12px' }}>{p.name}</h3>
                      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>{p.desc}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '20px' }}>
                        {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                      </div>
                      <button 
                        onClick={() => handleSelectProduct(p)}
                        style={{ width: '100%', padding: '14px', backgroundColor: isApproved ? '#10b981' : (p.isFree ? '#334155' : '#f59e0b'), color: p.isFree && !isApproved ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {p.isFree ? '무료 이용' : (isApproved ? '✅ 승인 완료 (결과 보기)' : '💳 무통장 입금 신청')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. 사주 정보 입력 폼 */}
        {currentPage === 'input' && (
          <div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.5)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '40px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '8px', textAlign: 'center' }}>사주팔자 정보 입력</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>정확한 4주 8자 산출을 위해 세부 출생 시간을 선택해 주세요.</p>
            
            {validationError && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(127, 29, 29, 0.4)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#fca5a5', fontSize: '14px' }}>
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSajuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>성함 또는 별칭</label>
                <input 
                  type="text" 
                  name="name" 
                  value={sajuForm.name} 
                  onChange={handleFormChange}
                  placeholder="홍길동"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>생년월일 (만세력 기준)</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={sajuForm.birthDate} 
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>양력 / 음력</label>
                  <select 
                    name="calendarType" 
                    value={sajuForm.calendarType} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="solar">양력</option>
                    <option value="lunar">음력</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>태어난 시간 (12지지)</label>
                  <select 
                    name="birthTime" 
                    value={sajuForm.birthTime} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="unknown">모름 (시간 미상)</option>
                    <option value="ja">자시 (23:00 ~ 00:59)</option>
                    <option value="chuk">축시 (01:00 ~ 02:59)</option>
                    <option value="in">인시 (03:00 ~ 04:59)</option>
                    <option value="myo">묘시 (05:00 ~ 06:59)</option>
                    <option value="jin">진시 (07:00 ~ 08:59)</option>
                    <option value="sa">사시 (09:00 ~ 10:59)</option>
                    <option value="o">오시 (11:00 ~ 12:59)</option>
                    <option value="mi">미시 (13:00 ~ 14:59)</option>
                    <option value="shin">신시 (15:00 ~ 16:59)</option>
                    <option value="yu">유시 (17:00 ~ 18:59)</option>
                    <option value="sul">술시 (19:00 ~ 20:59)</option>
                    <option value="hae">해시 (21:00 ~ 22:59)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>고민되는 질문 (선택)</label>
                <textarea 
                  name="question" 
                  value={sajuForm.question} 
                  onChange={handleFormChange}
                  placeholder="예: 이직 운이나 사업운, 또는 연애운이 궁금합니다."
                  rows="3"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', resize: 'none', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', padding: '15px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
              >
                사주팔자 정밀 계산 시작
              </button>
            </form>
          </div>
        )}

        {/* 4. 무료 명리 종합 결과 페이지 */}
        {currentPage === 'result' && readingResult && (
          <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 사주 8자 명식표 */}
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '36px', borderRadius: '24px', textAlign: 'center' }}>
              <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>FOUR PILLARS OF DESTINY — PROFESSIONAL REPORT</span>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', margin: '10px 0 20px 0' }}>{readingResult.name} 님의 정통 사주팔자 명식표</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '540px', margin: '0 auto 24px auto', backgroundColor: '#0b132b', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>시주(時柱)</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d' }}>{readingResult.sajuPillar.time}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>일주(日柱) - 본인</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>{readingResult.sajuPillar.day}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>월주(月柱)</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d' }}>{readingResult.sajuPillar.month}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>연주(年柱)</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d' }}>{readingResult.sajuPillar.year}</div>
                </div>
              </div>

              <div style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '10px' }}>
                사주 원국 중심 일간(日干): <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{readingResult.dayMaster}</span>
              </div>
            </div>

            {/* 오행 분포 계산 */}
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '16px', textAlign: 'center' }}>📊 사주 내 오행(五行) 정밀 수치 분석 분포</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><div style={{ color: '#4ade80', fontWeight: 'bold' }}>목(木)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['목']}개</div></div>
                <div><div style={{ color: '#f87171', fontWeight: 'bold' }}>화(火)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['화']}개</div></div>
                <div><div style={{ color: '#fbbf24', fontWeight: 'bold' }}>토(土)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['토']}개</div></div>
                <div><div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>금(金)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['금']}개</div></div>
                <div><div style={{ color: '#60a5fa', fontWeight: 'bold' }}>수(水)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['수']}개</div></div>
              </div>
            </div>

            {/* 6단계 구조화 카드 */}
            {[
              { key: 'personality', title: '🌳 타고난 사주 원국 및 본질적 성향', data: readingResult.personality },
              { key: 'romance', title: '💖 연애 성향 및 깊은 인연의 발전', data: readingResult.romance },
              { key: 'wealth', title: '💰 재물운 및 실질적 자산 관리 방안', data: readingResult.wealth },
              { key: 'career', title: '💼 직업운, 적성 및 진로 발전 가이드', data: readingResult.career },
              { key: 'relationships', title: '🤝 대인관계 및 지혜로운 소통 방법', data: readingResult.relationships },
              { key: 'health', title: '🧘 건강 유지 비결 및 신체 리듬 관리', data: readingResult.health },
              { key: 'timing', title: '⏳ 시기별 운세 흐름 (오늘·이번 주·대운의 방향)', data: readingResult.timing },
            ].map(section => (
              <div key={section.key} style={{ backgroundColor: 'rgba(28, 37, 65, 0.45)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: '#fcd34d', borderBottom: '1px solid rgba(245, 158, 11, 0.15)', paddingBottom: '10px' }}>
                  {section.title}
                </h3>
                
                <div style={{ fontSize: '15px', color: '#fef3c7', fontWeight: 'bold' }}>
                  📌 핵심 명리 진단: {section.data.summary}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7' }}>
                  <b>심층 전문 해설:</b> {section.data.detail}
                </div>
                <div style={{ fontSize: '14px', color: '#93c5fd', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  💡 <b>실생활 적용 예시:</b> {section.data.example}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5' }}>
                    ⚠️ <b>주의할 명리적 포인트:</b> {section.data.caution}
                  </div>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#6ee7b7' }}>
                    ✨ <b>긍정 기운 활용법:</b> {section.data.positive}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#fef08a', backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                  🏃 <b>지금 실천할 개운(開運) 조언:</b> {section.data.action}
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setCurrentPage('home')}
                style={{ padding: '14px 32px', backgroundColor: '#334155', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* 5. 유료 결과 페이지 */}
        {currentPage === 'paidResult' && selectedProduct && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '40px', borderRadius: '24px' }}>
            {approvedProducts.includes(selectedProduct.id) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '36px' }}>{selectedProduct.icon}</span>
                  <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#fef3c7', marginTop: '10px' }}>{selectedProduct.name} 정밀 리포트</h2>
                  <p style={{ color: '#34d399', fontSize: '13px', marginTop: '4px' }}>✅ 입금 확인 및 승인이 완료되어 열람 권한이 부여되었습니다.</p>
                </div>

                <div style={{ backgroundColor: '#0b132b', padding: '24px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', lineHeight: '1.8' }}>
                  <h3 style={{ color: '#fcd34d', fontSize: '18px', marginBottom: '12px' }}>📜 {selectedProduct.name} 심층 정통 명리 솔루션</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '16px' }}>
                    <b>{sajuForm.name || '고객'}</b>님의 사주 원국과 세부 시주(時柱), 대운의 흐름을 대조하여 산출된 <b>{selectedProduct.name}</b> 전용 심층 분석 결과입니다. 본 리포트는 십성 격국과 용신(用神)을 정밀 반영하여 제공됩니다.
                  </p>
                  <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.4)', color: '#fef3c7', fontSize: '14px' }}>
                    🌟 <b>전문 개운 솔루션:</b> 귀하의 타고난 강점을 극대화하고 현재 시기의 재성과 관성 에너지를 가장 지혜롭게 발휘하여 인생의 전환점을 맞이하세요.
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    style={{ padding: '14px 28px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
                <div style={{ fontSize: '48px' }}>🔒</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fca5a5' }}>입금 확인 대기 중</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{selectedProduct.name}</b> 상품은 입금 확인 승인이 완료되지 않았습니다.<br />
                  토스뱅크 계좌로 입금하신 후 운영자의 승인을 기다려 주세요.
                </p>
                <button 
                  onClick={() => setCurrentPage('products')}
                  style={{ padding: '12px 24px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  상품 목록으로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. 무통장 입금 신청 및 승인 대기 화면 */}
        {currentPage === 'payment' && selectedProduct && (
          <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '36px', borderRadius: '24px' }}>
            {paymentStep === 'checkout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7', textAlign: 'center' }}>무통장 입금 결제 안내</h2>
                
                <div style={{ padding: '16px', backgroundColor: '#0b132b', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>선택 상품</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginTop: '4px' }}>{selectedProduct.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginTop: '4px' }}>{selectedProduct.price.toLocaleString()}원</div>
                </div>

                <div style={{ padding: '18px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '14px', border: '1px dashed rgba(245, 158, 11, 0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#fcd34d', fontWeight: 'bold' }}>💳 실 입금 계좌 정보 (토스뱅크)</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{myAccount.bank} <span style={{ color: '#fcd34d' }}>{myAccount.accountNumber}</span></div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>예금주: {myAccount.holder}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>입금자명</label>
                  <input 
                    type="text" 
                    value={depositorName} 
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="실제 입금하실 분의 성함"
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>※ 계좌로 입금 후 아래 [입금 완료 신청]을 눌러주세요.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleConfirmDepositRequest}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    입금 완료 신청
                  </button>
                </div>
              </div>
            )}

            {/* 승인 대기 화면 */}
            {paymentStep === 'pending' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ fontSize: '48px' }}>⏳</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7' }}>입금 확인 대기 중</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{depositorName}</b>님의 입금 신청이 정상적으로 접수되었습니다.<br />
                  토스뱅크 계좌 입금이 확인되면 승인 처리되어 유료 리포트를 보실 수 있습니다.
                </p>
                
                <div style={{ padding: '14px', backgroundColor: '#0b132b', borderRadius: '10px', fontSize: '12px', color: '#94a3b8', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  입금 계좌: {myAccount.bank} {myAccount.accountNumber} ({myAccount.holder})
                </div>

                <button 
                  onClick={() => setCurrentPage('products')}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  상품 목록으로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 7. 개인 질문 1:1 상담 페이지 */}
        {currentPage === 'consult' && (
          <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.5)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '36px', borderRadius: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px' }}>🔮</span>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginTop: '8px' }}>명리 1:1 개인 질문 상담</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>연애, 진로, 인간관계 등 마음속 고민을 자유롭게 남겨주시면 명리학적 관점에서 정성스런 답변을 제공합니다.</p>
              </div>

              <form onSubmit={handleConsultSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea 
                  value={consultQuestion}
                  onChange={(e) => setConsultQuestion(e.target.value)}
                  placeholder="예: 이직을 고민 중인데 현재 시점에서 도전하는 것이 좋을까요? 혹은 연애 중 갈등을 해결하는 조언을 구합니다."
                  rows="4"
                  style={{ width: '100%', padding: '14px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', color: '#fff', resize: 'none', boxSizing: 'border-box', fontSize: '14px', lineHeight: '1.5' }}
                ></textarea>
                <button 
                  type="submit"
                  style={{ width: '100%', padding: '15px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' }}
                >
                  상담 답변 받아보기
                </button>
              </form>
            </div>

            {consultResult && (
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.7)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#fcd34d', fontWeight: 'bold' }}>질문 내용</span>
                  <div style={{ fontSize: '15px', color: '#fff', marginTop: '4px' }}>"{consultResult.question}"</div>
                </div>

                <div style={{ fontSize: '15px', color: '#fef3c7', fontWeight: 'bold' }}>
                  🎯 직접적인 답변: {consultResult.answerDirect}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <b>현재 상황 해석:</b> {consultResult.situation}
                </div>
                <div style={{ fontSize: '14px', color: '#38bdf8', lineHeight: '1.6' }}>
                  <b>☯️ 명리학적 관점:</b> {consultResult.sajuPerspective}
                </div>
                <div style={{ fontSize: '14px', color: '#93c5fd', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  💡 <b>구체적 예시:</b> {consultResult.example}
                </div>
                
                <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fcd34d' }}>🏃 단계별 실행 조언</div>
                  {consultResult.actionSteps.map((step, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#fef08a' }}>{step}</div>
                  ))}
                </div>

                <div style={{ fontSize: '13px', color: '#fca5a5', backgroundColor: 'rgba(127, 29, 29, 0.2)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  ⚠️ <b>주의할 점:</b> {consultResult.caution}
                </div>

                <div style={{ fontSize: '14px', color: '#e2e8f0', textAlign: 'center', fontStyle: 'italic', marginTop: '10px' }}>
                  {consultResult.closing}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 푸터 */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(245, 158, 11, 0.2)', padding: '30px 20px', textAlign: 'center', backgroundColor: '#0b132b', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p>월운(月運) | 정통 명리학 및 무통장 입금 승인형 서비스</p>
        <p>본 서비스는 정통 사주 명리 공식을 바탕으로 제작되었으며 참고용으로 활용하세요.</p>
      </footer>
    </div>
  );
}
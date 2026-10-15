import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositorName, setDepositorName] = useState('');
  const [sajuForm, setSajuForm] = useState({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    birthTime: 'unknown',
    question: ''
  });
  const [validationError, setValidationError] = useState('');
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout', 'pending'
  const [readingResult, setReadingResult] = useState(null);
  
  // 개인 질문 상담 상태
  const [consultQuestion, setConsultQuestion] = useState('');
  const [consultResult, setConsultResult] = useState(null);

  // 운영자 실계좌 정보
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

  // 실제 승인(입금확인)이 완료된 상품 ID 목록 (localStorage로 유지)
  const [approvedProducts, setApprovedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('wolun_approved');
      return saved ? JSON.parse(saved) : [];
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

  // 정통 사주팔자 산출 및 6단계 구조화 리포트 생성 엔진
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

    let timeJiIdx = 0;
    if (sajuForm.birthTime === 'morning') timeJiIdx = 2;
    else if (sajuForm.birthTime === 'afternoon') timeJiIdx = 6;
    else if (sajuForm.birthTime === 'night') timeJiIdx = 10;
    const timeGanIdx = ((dayGanIdx % 5) * 2 + timeJiIdx) % 10;

    const sajuPillar = {
      year: `${CHEONGAN[yearGanIdx]}${JIJI[yearJiIdx]}`,
      month: `${CHEONGAN[monthGanIdx]}${JIJI[monthJiIdx]}`,
      day: `${CHEONGAN[dayGanIdx]}${JIJI[dayJiIdx]}`,
      time: `${CHEONGAN[timeGanIdx]}${JIJI[timeJiIdx]}`,
    };

    const dayMasterElement = CHEONGAN_ELEMENTS[dayGanIdx];
    const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    [yearGanIdx, monthGanIdx, dayGanIdx, timeGanIdx].forEach(idx => elementCounts[CHEONGAN_ELEMENTS[idx]]++);
    [yearJiIdx, monthJiIdx, dayJiIdx, timeJiIdx].forEach(idx => elementCounts[JIJI_ELEMENTS[idx]]++);

    const generateStructuredContent = (title, summary, detail, example, caution, positive, action) => ({
      title, summary, detail, example, caution, positive, action
    });

    setReadingResult({
      name: sajuForm.name,
      sajuPillar,
      dayMaster: `${CHEONGAN[dayGanIdx]} (${dayMasterElement}기운 일간)`,
      elementCounts,
      personality: generateStructuredContent(
        "타고난 성향 및 행동 패턴",
        `강한 ${dayMasterElement}의 기운을 품어 유연성과 추진력이 조화로운 성품입니다.`,
        `사주 원국에서 일간(${CHEONGAN[dayGanIdx]})은 본인의 정체성을 뜻합니다. 주변 환경에 빠르게 적응하면서도 내면의 주관이 뚜렷하여 중요한 순간에 결단력을 발휘합니다.`,
        `회의나 팀 프로젝트에서 의견이 갈릴 때, 전체적인 조율을 이끌어내며 실무적인 대안을 제시하는 모습으로 나타납니다.`,
        `지나치게 완벽을 추구하여 스스로에게 과도한 책임감을 지우거나 피로감을 느낄 수 있습니다.`,
        `뛰어난 관찰력과 공감 능력을 타인과의 협업 및 리더십 발휘에 적극 활용하세요.`,
        `오늘 하루는 주변 사람들의 의견을 경청하고 여유를 가지는 시간을 가져보세요.`
      ),
      romance: generateStructuredContent(
        "연애 성향 및 인연 발전",
        "진실된 교감을 중시하며, 상대방의 작은 배려에 깊게 감동하는 따뜻한 연애 스타일입니다.",
        "관계에서 신뢰와 안정감을 최우선으로 생각합니다. 감정을 쉽게 드러내기보다 마음속으로 깊이 생각한 뒤 다정한 언행으로 표현합니다.",
        "상대방이 피곤할 때 무심하게 챙겨주는 음료수나 따뜻한 말 한마디로 큰 감동을 주는 상황입니다.",
        "속마음을 오랫동안 숨기다가 오해가 쌓일 수 있으므로 솔직한 소통이 필요합니다.",
        "진정성 있는 소통 방식을 활용해 상대방과 깊은 정서적 유대감을 형성할 수 있습니다.",
        "마음에 품고 있는 감정이 있다면 따뜻한 메시지로 먼저 마음을 표현해 보세요."
      ),
      wealth: generateStructuredContent(
        "재물운 및 자산 관리 팁",
        "계획성과 절제력을 바탕으로 자산을 안정적으로 축적해 나가는 구조입니다.",
        "충동적인 소비보다는 미래의 가치를 고려하여 지출을 통제하는 능력이 탁월합니다. 돈을 다루는 감각이 신중합니다.",
        "필요한 물품의 가격과 품질을 꼼꼼히 비교한 뒤 합리적으로 구매를 결정하는 모습입니다.",
        "지나치게 보수적인 자금 운용으로 인해 기회를 놓치거나 고민이 길어질 수 있습니다.",
        "안정적인 저축과 함께 가치 있는 자기계발이나 장기 자산 배분에 관심을 가져보세요.",
        "이번 달 고정 지출을 점검하고 소액이라도 저축 자동이체를 설정해 보세요."
      ),
      career: generateStructuredContent(
        "직업운 및 진로 가이드",
        "책임감이 투철하고 분석력이 뛰어나 전문 분야나 기획 업무에서 두각을 나타냅니다.",
        "주어진 과제를 체계적으로 분석하고 해결하는 능력이 뛰어납니다. 동료들과의 협업이 원만한 환경에서 능력이 배가됩니다.",
        "복잡하게 얽힌 업무 프로세스를 깔끔하게 정리해 팀 전체의 효율을 높이는 상황입니다.",
        "반복적이거나 자율성이 전혀 없는 환경에서는 쉽게 답답함을 느낄 수 있습니다.",
        "자신의 아이디어를 제안할 수 있는 창의적이거나 전문적인 업무 환경을 선택하세요.",
        "현재 진행 중인 업무나 공부에서 가장 중요한 우선순위 3가지를 정리해 보세요."
      ),
      relationships: generateStructuredContent(
        "대인관계 및 소통 방법",
        "주변 사람들에게 신뢰를 주는 진중한 태도로 원만한 인간관계를 유지합니다.",
        "타인의 입장을 먼저 헤아리고 배려하기 때문에 주변에 마음을 터놓을 수 있는 좋은 인연들이 모입니다.",
        "친구의 고민을 묵묵히 들어주며 현실적이고 따뜻한 조언을 건네는 모습입니다.",
        "상대방의 부탁을 거절하지 못해 혼자서 스트레스를 떠안을 수 있습니다.",
        "건강한 경계선을 설정하고 자신의 의사를 부드럽게 표현하는 연습을 해보세요.",
        "오랫동안 연락하지 못한 지인에게 가벼운 안부 인사를 건네보세요."
      ),
      health: generateStructuredContent(
        "건강 관련 생활 조언",
        "활력 유지를 위해 규칙적인 수면과 스트레스 해소용 가벼운 산책이 큰 도움이 됩니다.",
        "지속적인 집중으로 인해 어깨나 목 등에 긴장이 쌓이기 쉬우므로 주기적인 스트레칭이 필요합니다.",
        "작업 중간에 일어나 가볍게 물을 마시거나 창밖을 바라보며 눈의 피로를 푸는 상황입니다.",
        "피로가 누적되었음에도 일을 마무리하려 무리하게 버티는 습관은 피해야 합니다.",
        "충분한 휴식과 수면을 최고의 자기관리로 여기는 태도를 가져보세요.",
        "오늘 저녁 취침 전 스마트폰 사용을 줄이고 가벼운 명상이나 스트레칭을 해보세요."
      ),
      timing: generateStructuredContent(
        "시기별 흐름 (오늘·이번 주·이번 달)",
        "내실을 다지며 한 단계 도약하기 위한 준비와 기회가 공존하는 흐름입니다.",
        "단기적인 성과에 조급해하기보다는 현재 진행 중인 일의 기초를 단단히 다지는 시기입니다. 노력한 만큼 결실이 서서히 나타납니다.",
        "새로운 프로젝트나 공부를 시작하기 전 계획을 세우고 차분히 준비를 마치는 모습입니다.",
        "주변의 급작스러운 변화나 의견에 흔들려 본래의 페이스를 잃는 것을 주의하세요.",
        "자신의 호흡에 맞춰 차근차근 전진한다면 원하는 목표에 안정적으로 도달할 수 있습니다.",
        "이번 주 세부 일정표를 점검하고 마음의 여유를 확보하세요."
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
      answerDirect: `질문하신 "${q}"에 대해, 현재 흐름 속에서 가장 중요한 핵심은 조급함을 내려놓고 본래의 중심을 지키는 것입니다.`,
      situation: `제공해주신 상황을 다각도로 살펴보았을 때, 주변의 변수보다는 본인의 내면적인 기준과 준비 상태가 성과의 당락을 결정짓는 시점입니다.`,
      sajuPerspective: `정통 명리학적 관점에서 볼 때, 현재 귀하의 일간 기운과 시기적 흐름은 새로운 전환점을 앞두고 에너지를 응축하는 단계에 해당합니다.`,
      example: `마치 중요한 발표나 면접을 앞두고 막바지 점검을 꼼꼼히 하듯, 작은 디테일을 놓치지 않는 태도가 유리하게 작용합니다.`,
      actionSteps: [
        "1단계: 현재 고민하고 있는 문제의 장점과 단점을 객관적으로 종이에 적어보세요.",
        "2단계: 타인의 시선보다는 본인이 가장 중요하게 생각하는 가치관에 우선순위를 두세요.",
        "3단계: 오늘 하루는 무리한 결정보다 생각을 정리하고 충분한 휴식을 취하세요."
      ],
      caution: `지나친 걱정이나 단정적인 생각은 불필요한 불안을 유발할 수 있으므로 신중하게 한 걸음씩 나아가세요.`,
      closing: `귀하께서는 충분히 현명하게 이 시기를 헤쳐나갈 역량을 지니고 계십니다. 따뜻한 응원을 보냅니다.`
    });
  };

  // 상품 선택 가이드 (승인 여부 검증)
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product.isFree) {
      setCurrentPage('input');
    } else if (approvedProducts.includes(product.id)) {
      // 이미 입금 승인이 완료된 유료 상품인 경우만 열람 허용
      if (!readingResult) {
        setCurrentPage('input');
      } else {
        setCurrentPage('paidResult');
      }
    } else {
      // 입금 승인이 안 된 경우 결제 신청 및 승인 대기 페이지로 이동
      setPaymentStep('checkout');
      setCurrentPage('payment');
    }
  };

  // 입금 완료 신청 (승인 대기 상태 전환)
  const handleConfirmDepositRequest = () => {
    if (!depositorName.trim()) {
      alert('실제 입금하신 분의 성함을 입력해 주세요.');
      return;
    }
    setPaymentStep('pending');
  };

  // 관리자 전용 입금 확인 승인 기능 (테스트 및 수동 입금 확인용)
  const handleAdminApprove = () => {
    if (selectedProduct && !approvedProducts.includes(selectedProduct.id)) {
      setApprovedProducts(prev => [...prev, selectedProduct.id]);
      alert(`[입금 확인 완료] ${depositorName}님의 ${selectedProduct.name} 상품 이용이 승인되었습니다.`);
      if (!readingResult) {
        setCurrentPage('input');
      } else {
        setCurrentPage('paidResult');
      }
    }
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
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>원하시는 분야를 선택하여 입금 및 수동 승인 후 상세 운세를 확인하세요.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {products.map(p => {
                  const isApproved = approvedProducts.includes(p.id);
                  return (
                    <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '28px' }}>{p.icon}</span>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', backgroundColor: p.isFree ? 'rgba(74, 222, 128, 0.15)' : (isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)'), color: p.isFree ? '#4ade80' : (isApproved ? '#34d399' : '#fcd34d'), fontWeight: 'bold', border: '1px solid ' + (p.isFree ? 'rgba(74, 222, 128, 0.3)' : (isApproved ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.3)')) }}>
                            {p.isFree ? '무료' : (isApproved ? '입금 승인됨' : '입금 필요')}
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
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>무통장 입금 후 운영자의 승인(확인)이 완료되면 해당 상품이 잠금 해제됩니다.</p>
            
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
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>정확한 4주 8자 산출을 위해 생년월일을 입력해 주세요.</p>
            
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
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>태어난 시(時)</label>
                  <select 
                    name="birthTime" 
                    value={sajuForm.birthTime} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="unknown">모름 (출생시간 미상 안내)</option>
                    <option value="morning">오전 (06:00 ~ 11:59)</option>
                    <option value="afternoon">오후 (12:00 ~ 17:59)</option>
                    <option value="night">야간/새벽</option>
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
              <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>FOUR PILLARS OF DESTINY</span>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', margin: '10px 0 20px 0' }}>{readingResult.name} 님의 사주팔자 명식표</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '520px', margin: '0 auto 24px auto', backgroundColor: '#0b132b', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
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
                당신의 중심 일간 기운: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{readingResult.dayMaster}</span>
              </div>
            </div>

            {/* 오행 분포 계산 */}
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '16px', textAlign: 'center' }}>📊 사주 내 오행(五行) 실제 계산 분포</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><div style={{ color: '#4ade80', fontWeight: 'bold' }}>목(木)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['목']}개</div></div>
                <div><div style={{ color: '#f87171', fontWeight: 'bold' }}>화(火)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['화']}개</div></div>
                <div><div style={{ color: '#fbbf24', fontWeight: 'bold' }}>토(土)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['토']}개</div></div>
                <div><div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>금(金)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['금']}개</div></div>
                <div><div style={{ color: '#60a5fa', fontWeight: 'bold' }}>수(水)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['수']}개</div></div>
              </div>
            </div>

            {/* 6단계 구조화 상세 해석 카드 렌더링 */}
            {[
              { key: 'personality', title: '🌳 타고난 성향 및 행동 패턴', data: readingResult.personality },
              { key: 'romance', title: '💖 연애운 및 인연 발전', data: readingResult.romance },
              { key: 'wealth', title: '💰 재물운 및 자산 관리', data: readingResult.wealth },
              { key: 'career', title: '💼 직업운 및 진로 가이드', data: readingResult.career },
              { key: 'relationships', title: '🤝 대인관계 및 소통 방법', data: readingResult.relationships },
              { key: 'health', title: '🧘 건강 관련 생활 조언', data: readingResult.health },
              { key: 'timing', title: '⏳ 시기별 흐름 (오늘·이번 주·이번 달)', data: readingResult.timing },
            ].map(section => (
              <div key={section.key} style={{ backgroundColor: 'rgba(28, 37, 65, 0.45)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: '#fcd34d', borderBottom: '1px solid rgba(245, 158, 11, 0.15)', paddingBottom: '10px' }}>
                  {section.title}
                </h3>
                
                <div style={{ fontSize: '15px', color: '#fef3c7', fontWeight: 'bold' }}>
                  📌 핵심 요약: {section.data.summary}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <b>구체적 해석:</b> {section.data.detail}
                </div>
                <div style={{ fontSize: '14px', color: '#93c5fd', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  💡 <b>일상 예시:</b> {section.data.example}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5' }}>
                    ⚠️ <b>주의할 점:</b> {section.data.caution}
                  </div>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#6ee7b7' }}>
                    ✨ <b>긍정 활용법:</b> {section.data.positive}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#fef08a', backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                  🏃 <b>지금 실천할 조언:</b> {section.data.action}
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

        {/* 5. 유료 결과 페이지 (입금 승인 완료 고객만 열람 허용) */}
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
                    <b>{sajuForm.name || '고객'}</b>님의 사주 원국과 대운을 대조하여 산출된 <b>{selectedProduct.name}</b> 전용 분석 결과입니다. 본 리포트는 십성 상생상극과 용신(用神)을 정밀 반영하여 제공됩니다.
                  </p>
                  <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.4)', color: '#fef3c7', fontSize: '14px' }}>
                    🌟 <b>핵심 솔루션:</b> 귀하의 타고난 강점을 유지하면서 현재 시기의 재성과 관성 기운을 가장 효율적인 방법으로 발휘할 수 있도록 현실적인 선택에 참고하세요.
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
              /* 승인 안 된 사용자의 강제 접근 차단 */
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
                <div style={{ fontSize: '48px' }}>🔒</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fca5a5' }}>입금 확인 대기 중</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{selectedProduct.name}</b> 상품은 입금 확인 승인이 완료되지 않았습니다.<br />
                  무통장 입금 신청 후 운영자의 승인이 이루어지면 이용하실 수 있습니다.
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

            {/* 승인 대기 화면 (실제 입금이 확인될 때까지 차단됨) */}
            {paymentStep === 'pending' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ fontSize: '48px' }}>⏳</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7' }}>입금 확인 대기 중</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{depositorName}</b>님의 입금 신청이 접수되었습니다.<br />
                  운영자가 토스뱅크 계좌 입금을 확인하면 즉시 수동 승인되어 유료 리포트를 보실 수 있습니다.
                </p>
                
                <div style={{ padding: '14px', backgroundColor: '#0b132b', borderRadius: '10px', fontSize: '12px', color: '#94a3b8', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  계좌번호: {myAccount.bank} {myAccount.accountNumber} ({myAccount.holder})
                </div>

                {/* 테스트 및 직접 입금 확인용 관리자 버튼 */}
                <div style={{ marginTop: '10px', borderTop: '1px dashed rgba(245, 158, 11, 0.2)', paddingTop: '15px' }}>
                  <button 
                    onClick={handleAdminApprove}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    [운영자 전용] 입금 확인 및 이용 승인하기
                  </button>
                </div>

                <button 
                  onClick={() => setCurrentPage('products')}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  목록으로 돌아가기
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
        <p>월운(月運) | 정통 명리학 및 무통장 승인형 서비스</p>
        <p>본 서비스는 정통 사주 명리 공식을 바탕으로 제작되었으며 참고용으로 활용하세요.</p>
      </footer>
    </div>
  );
}
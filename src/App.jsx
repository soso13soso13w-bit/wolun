import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositorName, setDepositorName] = useState('');
  const [sajuForm, setSajuForm] = useState({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    birthTime: 'unknown',
    interest: 'comprehensive',
    question: ''
  });
  const [validationError, setValidationError] = useState('');
  const [paymentStep, setPaymentStep] = useState('checkout');
  const [readingResult, setReadingResult] = useState(null);

  // 계좌 정보
  const myAccount = {
    bank: '토스뱅크',
    accountNumber: '1002-1526-1128',
    holder: '송시우'
  };

  const products = [
    { id: 'free', name: '오늘의 일주(日柱) 운세', price: 0, desc: '오늘의 천간지지 기운과 일간의 생극 관계 분석' },
    { id: 'custom', name: '정통 사주팔자 8자 분석', price: 3900, desc: '연월일시 4주 8자 산출 및 오행 분포 분석' },
    { id: 'comprehensive', name: '십성·격국 정통 종합 사주', price: 9900, desc: '비겁·식상·재성·관성·인성 십성 분석 및 용신 정밀 진단' },
    { id: 'ai', name: '명리 1:1 맞춤 상담', price: 4900, desc: '고객 고민에 맞춘 정통 사주학 기반 대운/세운 풀이' },
  ];

  // 천간 및 지지 정통 명리학 데이터 셋
  const CHEONGAN = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];
  const CHEONGAN_ELEMENTS = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
  
  const JIJI = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];
  const JIJI_ELEMENTS = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSajuForm(prev => ({ ...prev, [name]: value }));
  };

  // 정통 사주팔자 산출 및 명리학 해석 공식 엔진
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

    // 1. 연주(年柱) 산출 공식 (입춘 기준 간이 산출법)
    const yearGanIdx = (y - 4) % 10 < 0 ? (y - 4) % 10 + 10 : (y - 4) % 10;
    const yearJiIdx = (y - 4) % 12 < 0 ? (y - 4) % 12 + 12 : (y - 4) % 12;

    // 2. 월주(月柱) 산출 공식 (월건법)
    const monthJiIdx = (m + 1) % 12;
    const monthGanIdx = ((yearGanIdx % 5) * 2 + m) % 10;

    // 3. 일주(日柱) 산출 공식 (일간이 본인을 상징)
    const dayBase = Math.floor(y * 365.25) + Math.floor(m * 30.6) + d;
    const dayGanIdx = (dayBase + 9) % 10;
    const dayJiIdx = (dayBase + 1) % 12;

    // 4. 시주(時柱) 산출 공식 (시두법)
    let timeJiIdx = 0; // 기본 자시(子時)
    if (sajuForm.birthTime === 'morning') timeJiIdx = 2; // 인~진시
    else if (sajuForm.birthTime === 'afternoon') timeJiIdx = 6; // 오~신시
    else if (sajuForm.birthTime === 'night') timeJiIdx = 10; // 술~해시
    const timeGanIdx = ((dayGanIdx % 5) * 2 + timeJiIdx) % 10;

    // 사주 8자 완성
    const sajuPillar = {
      year: `${CHEONGAN[yearGanIdx]}${JIJI[yearJiIdx]}`,
      month: `${CHEONGAN[monthGanIdx]}${JIJI[monthJiIdx]}`,
      day: `${CHEONGAN[dayGanIdx]}${JIJI[dayJiIdx]}`, // 일주
      time: `${CHEONGAN[timeGanIdx]}${JIJI[timeJiIdx]}`,
    };

    // 5. 일간(Day Master) 기준 오행 분포 및 성향 분석
    const dayMasterElement = CHEONGAN_ELEMENTS[dayGanIdx]; // 본인의 고유 기운
    
    // 오행 개수 계산
    const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    [yearGanIdx, monthGanIdx, dayGanIdx, timeGanIdx].forEach(idx => elementCounts[CHEONGAN_ELEMENTS[idx]]++);
    [yearJiIdx, monthJiIdx, dayJiIdx, timeJiIdx].forEach(idx => elementCounts[JIJI_ELEMENTS[idx]]++);

    // 6. 일간별 본성 및 십성 해석
    const elementProfiles = {
      목: {
        nature: '갑목/을목의 성정을 타고나 곧게 뻗어나가는 인자함(仁)과 추진력이 뛰어납니다. 새로운 일에 대한 창의성이 높고 결단력이 강합니다.',
        tenStars: '비겁(비견·겁재)과 식상(식신·상관)의 기운이 강하여 표현력과 창작력이 우수하고 주도적으로 일을 이끄는 명입니다.',
        wealth: '재성(편재·정재)의 기운을 다스릴 수 있는 힘이 있어 성실한 자산 축적이 유효하며 결실을 맺는 능력이 뛰어납니다.',
        career: '목 기운의 확장에 따라 교육, 기획, 창작, 벤처, 건축 분야에서 크게 발전하는 사주 구조입니다.'
      },
      화: {
        nature: '병화/정화의 기운으로 예의(禮)와 열정이 넘치며 타인을 사로잡는 화려함과 진실된 감정 표현이 장점입니다.',
        tenStars: '식상과 재성의 흐름이 활발하여 대인관계 능력이 탁월하고 자신의 아이디어를 현실적인 성과로 바꾸는 힘이 강합니다.',
        wealth: '화려한 재물운을 가지고 있으나, 강한 열정으로 인한 지출을 조절하고 정재(안정적 재물)를 지키는 것이 핵심입니다.',
        career: '미디어, 예술, 소통, 서비스, IT 등 자신을 드러내고 빛을 발하는 직종에 최적화된 사주입니다.'
      },
      토: {
        nature: '무토/기토의 성정으로 신의(信)와 중용의 덕을 갖추었습니다. 포용력이 크고 쉽게 흔들리지 않는 안정감이 강점입니다.',
        tenStars: '인성(편인·정인)과 비겁의 조화로 조력자가 많으며, 깊은 생각과 단단한 내면으로 사람들을 중재하는 역할을 맡습니다.',
        wealth: '토(土)는 모든 결실을 담는 창고 역할을 하므로 장기적인 저축과 부동산, 자산 관리에 강한 면모를 보입니다.',
        career: '관리, 중개, 금융, 컨설팅, 행정 등 조직의 중심을 잡고 안정성을 더하는 영역에서 뛰어난 성과를 냅니다.'
      },
      금: {
        nature: '경금/신금의 기운으로 의리(義)가 두텁고 결단력이 시원스럽습니다. 냉철한 판단력과 마무리가 깔끔한 것이 특징입니다.',
        tenStars: '관성(편관·정관)과 인성의 결합이 우수하여 규율과 절제를 중시하며 조직 내에서 빠르게 신뢰를 얻습니다.',
        wealth: '정교한 자산 분석 능력을 갖추어 체계적인 재테크에 강하며 실속을 꼼꼼하게 챙기는 구조입니다.',
        career: '법률, 의료, 금융, 엔지니어링, 정밀 기술 등 칼날 같은 전문성이 요구되는 분야에서 대성합니다.'
      },
      수: {
        nature: '임수/계수의 기운으로 지혜(智)가 깊고 지혜로우며, 어떤 그릇에든 맞춰지는 유연성과 깊은 통찰력을 지녔습니다.',
        tenStars: '인성과 식상의 조화가 뛰어나 연구, 학습, 학문에 깊은 소질을 보이며 유연한 대인관계를 형성합니다.',
        wealth: '물의 흐름처럼 재물이 끊이지 않고 유입되는 구조로, 유동성 자산 관리에 명확한 감각을 지니고 있습니다.',
        career: '연구, 기획, 학문, 무역, 유통 등 넓은 시야와 지혜를 활용하는 분야에서 능력을 발휘합니다.'
      }
    };

    const profile = elementProfiles[dayMasterElement];

    setReadingResult({
      name: sajuForm.name,
      sajuPillar: sajuPillar,
      dayMaster: `${CHEONGAN[dayGanIdx]} (${dayMasterElement}기운 일간)`,
      elementCounts: elementCounts,
      nature: profile.nature,
      tenStars: profile.tenStars,
      wealth: profile.wealth,
      career: profile.career,
      questionNote: sajuForm.question 
        ? `질문하신 "${sajuForm.question}"에 대한 명리학적 조언: 일주 ${sajuPillar.day}의 기운과 대운의 흐름을 보았을 때, 본인의 일간 기운을 약화시키지 않는 유연한 태도로 신중히 접근하면 관성(운)의 도모를 이룰 수 있습니다.`
        : null
    });

    setCurrentPage('result');
  };

  const handleStartPayment = (product) => {
    setSelectedProduct(product);
    setDepositorName('');
    setPaymentStep('checkout');
    setCurrentPage('payment');
  };

  const handleConfirmDeposit = () => {
    if (!depositorName.trim()) {
      alert('입금자명을 입력해 주세요.');
      return;
    }
    setPaymentStep('complete');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b132b', color: '#f8fafc', paddingBottom: '60px' }}>
      {/* 상단 헤더 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(11, 19, 43, 0.95)', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ background: 'none', border: 'none', color: '#fef3c7', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>☯️</span> 월운 (月運) — 정통 명리학
          </button>
          
          <nav style={{ display: 'flex', gap: '24px', fontSize: '15px' }}>
            <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>홈</button>
            <button onClick={() => setCurrentPage('input')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>사주팔자 분석</button>
            <button onClick={() => setCurrentPage('products')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>유료 풀이</button>
          </nav>

          <button 
            onClick={() => setCurrentPage('input')}
            style={{ padding: '10px 18px', background: 'linear-gradient(to right, #d97706, #f59e0b)', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
          >
            무료 사주 분석
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ textAlign: 'center', padding: '65px 20px', background: 'linear-gradient(to bottom, rgba(28, 37, 65, 0.6), transparent)', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                📜 만세력 기반 4주 8자 정통 명리학 Engine
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '20px', lineHeight: '1.3' }}>
                당신의 태어난 연·월·일·시가 그려내는<br />사주팔자(四柱八字) 정밀 분석
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.7', fontSize: '15px' }}>
                월운(月運)은 정확한 음양오행 법칙과 일간 기준 십성(十星) 상생상극 원리를 바탕으로 당신의 타고난 성품, 재물, 직업, 인연의 운명을 명쾌하게 풀어냅니다.
              </p>
              <button 
                onClick={() => setCurrentPage('input')}
                style={{ padding: '16px 36px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)' }}
              >
                내 사주팔자 확인하기 ➔
              </button>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '24px', textAlign: 'center' }}>월운 정통 명리 서비스</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {products.map(p => (
                  <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '10px' }}>{p.name}</h3>
                      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</p>
                    </div>
                    <div>
                      <div style={{ color: '#fcd34d', fontWeight: 'bold', marginBottom: '16px' }}>
                        {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                      </div>
                      <button 
                        onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', color: '#f8fafc', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                      >
                        {p.price === 0 ? '바로 분석하기' : '신청하기'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'products' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '10px', textAlign: 'center' }}>정통 명리학 심층 상품</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>원하시는 사주 정밀 분석 서비스를 신청해 보세요.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {products.map(p => (
                <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '12px' }}>{p.name}</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>{p.desc}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '20px' }}>
                      {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                    </div>
                    <button 
                      onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                      style={{ width: '100%', padding: '14px', backgroundColor: p.price === 0 ? '#334155' : '#f59e0b', color: p.price === 0 ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {p.price === 0 ? '무료 이용' : '무통장 입금 신청'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    <option value="unknown">모름</option>
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

        {currentPage === 'result' && readingResult && (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* 사주 8자 명식표 */}
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '36px', borderRadius: '24px', textAlign: 'center' }}>
              <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>FOUR PILLARS OF DESTINY</span>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', margin: '10px 0 20px 0' }}>{readingResult.name} 님의 사주팔자 명식표</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '500px', margin: '0 auto 24px auto', backgroundColor: '#0b132b', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
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

              <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
                당신의 중심 기운: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{readingResult.dayMaster}</span>
              </div>
            </div>

            {/* 오행 분포표 */}
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '16px', textAlign: 'center' }}>📊 사주 내 오행(五行) 분포 계산</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><div style={{ color: '#4ade80', fontWeight: 'bold' }}>목(木)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['목']}개</div></div>
                <div><div style={{ color: '#f87171', fontWeight: 'bold' }}>화(火)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['화']}개</div></div>
                <div><div style={{ color: '#fbbf24', fontWeight: 'bold' }}>토(土)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['토']}개</div></div>
                <div><div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>금(金)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['금']}개</div></div>
                <div><div style={{ color: '#60a5fa', fontWeight: 'bold' }}>수(水)</div><div style={{ fontSize: '18px', marginTop: '4px' }}>{readingResult.elementCounts['수']}개</div></div>
              </div>
            </div>

            {/* 정통 사주 해석 결과 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>🌳 일간 타고난 성정 및 기질</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.nature}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>⭐ 십성(十星) 및 육친 관계</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.tenStars}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>💰 재성(財星) 및 재물운 분석</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.wealth}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>💼 관성(官星) 및 적성/진로</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.career}</p>
              </div>
            </div>

            {readingResult.questionNote && (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '8px' }}>💬 사주 관성 기반 고민 해결</h3>
                <p style={{ color: '#fef3c7', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.questionNote}</p>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setCurrentPage('home')}
                style={{ padding: '14px 32px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* 무통장 입금 결제 화면 */}
        {currentPage === 'payment' && selectedProduct && (
          <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '36px', borderRadius: '24px' }}>
            {paymentStep === 'checkout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7', textAlign: 'center' }}>무통장 입금 신청</h2>
                
                <div style={{ padding: '16px', backgroundColor: '#0b132b', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>선택한 상품</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginTop: '4px' }}>{selectedProduct.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginTop: '4px' }}>{selectedProduct.price.toLocaleString()}원</div>
                </div>

                <div style={{ padding: '18px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '14px', border: '1px dashed rgba(245, 158, 11, 0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#fcd34d', fontWeight: 'bold' }}>💳 입금 계좌 정보</div>
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
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>※ 입금 확인 후 정밀 사주 풀이가 진행됩니다.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleConfirmDeposit}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    입금 완료 신청
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'complete' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ fontSize: '48px' }}>📩</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7' }}>입금 확인 신청 완료</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{depositorName}</b>님의 입금 신청이 접수되었습니다.<br />
                  입금 확인 후 정밀 사주 풀이가 진행됩니다.
                </p>
                <div style={{ padding: '14px', backgroundColor: '#0b132b', borderRadius: '10px', fontSize: '13px', color: '#94a3b8' }}>
                  문의사항은 카카오톡 채널 또는 이메일로 연락주세요.
                </div>
                <button 
                  onClick={() => setCurrentPage('input')}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  사주 정보 입력하러 가기
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(245, 158, 11, 0.2)', padding: '30px 20px', textAlign: 'center', backgroundColor: '#0b132b', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p>월운(月運) | 정통 명리학 사주 풀이 데모</p>
        <p>본 서비스는 정통 사주 명리학 공식을 바탕으로 제작되었으며 참고용으로 활용하세요.</p>
      </footer>
    </div>
  );
}
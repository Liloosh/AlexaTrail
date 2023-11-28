using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.RefDTO;
using backend.Repository;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefController : ControllerBase
    {
        private readonly IRefRepository refRepository;
        private readonly AppDbContext appDbContext;

        public RefController(IRefRepository refRepository, AppDbContext appDbContext)
        {
            this.refRepository = refRepository;
            this.appDbContext = appDbContext;
        }

        [HttpPost]
        [Route("{refsGroupId:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateRef([FromRoute]Guid refsGroupId, [FromBody] List<CreateRefDTO> refs)
        {
            var refsList = await refRepository.getAllRefs(refsGroupId);

            switch (refs.Count)
            {
                case 1:
                    if (refsList.Count == 0)
                    {
                        refs[0].Order = 1;
                    }
                    else if (refsList[refsList.Count - 1].Order < refs[0].Order)
                    {
                        refs[0].Order = refsList[refsList.Count - 1].Order + 1;
                    }
                    break;
                case 2:
                    if (refsList.Count == 0)
                    {
                        refs[0].Order = 1;
                        refs[1].Order = 1;
                    }
                    else if (refsList[refsList.Count - 1].Order < refs[0].Order)
                    {
                        refs[0].Order = refsList[refsList.Count - 1].Order + 1;
                        refs[1].Order = refsList[refsList.Count - 1].Order + 1;
                    }
                    break;
            }

            if (refsList.Count != 0 && refsList[refsList.Count - 1].Order >= refs[0].Order)
            {
                int index = 0;

                for (int i = 0; i < refsList.Count; i++)
                {
                    if (refsList[i].Order == refs[0].Order)
                    {
                        index = i; break;
                    }
                }

                for (int i = index; i < refsList.Count; i++)
                {
                    refsList[i].Order = refsList[i].Order + 1;
                }

                appDbContext.Ref.UpdateRange(refsList);
                await appDbContext.SaveChangesAsync();
            }
            
            switch (refs.Count)
            {
                case 1:
                    var Ref1 = new Ref()
                    {
                        URL = refs[0].URL,
                        Text = refs[0].Text,
                        Type = refs[0].Type,
                        Order = refs[0].Order,
                        RefsGroupId = refsGroupId
                    };
                    var RefDTO1 = await refRepository.createNewRef(Ref1);
                    break;
                case 2:
                    var Ref11 = new Ref()
                    {
                        URL = refs[0].URL,
                        Text = refs[0].Text,
                        Type = refs[0].Type,
                        Order = refs[0].Order,
                        DoubleRef = true,
                        OrderInRef = 1,
                        RefsGroupId = refsGroupId
                    };

                    var Ref2 = new Ref()
                    {
                        URL = refs[1].URL,
                        Text = refs[1].Text,
                        Type = refs[1].Type,
                        Order = refs[1].Order,
                        DoubleRef = true,
                        OrderInRef = 2,
                        RefsGroupId = refsGroupId
                    };

                    var RefDTO11 = await refRepository.createNewRef(Ref11);
                    var RefDTO2 = await refRepository.createNewRef(Ref2);
                    break;
            }

            return Ok("Success");
        }

        [HttpGet]
        [Route("{refsId:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllRef([FromRoute] Guid refsId)
        {
            int countOfDoubleRefs = 0;
            var refs = await refRepository.getAllRefs(refsId);

            if ( refs == null)
            {
                return NotFound(new { message = "Nothing was found"});
            }

            return Ok(refs);    
        }

        [HttpDelete]
        [Route("{refGroupId:Guid}")]
        public async Task<IActionResult> DeleteRef([FromRoute] Guid refGroupId, [FromBody] Guid refId)
        {
            var Ref = await refRepository.deleteRef(refId, refGroupId);

            if(Ref == null)
            {
                return Ok(null);
            }

            return Ok(Ref);
        }

        [HttpPatch]
        [Route("{refsGroupId:Guid}")]
        public async Task<IActionResult> UpdateRef([FromRoute] Guid refsGroupId, [FromBody] List<UpdateDTO> refs)
        {
            var newRef = await refRepository.updateRef(refsGroupId, refs);

            if (newRef == null)
            {
                return NoContent();
            }

            return Ok(newRef);
        }

        [HttpPut]
        [Route("{refsGroupId:Guid}")]
        public async Task<IActionResult> UpdateDragAndDrop([FromRoute] Guid refsGroupId, [FromBody] List<RefDTO> refDTOs)
        {
            var refs = await refRepository.UpdateDragAndDrop(refsGroupId, refDTOs);
            if (refs == null)
            {
                return BadRequest("Something was wrong");
            }
            return Ok("Ok");
        }
    }

}

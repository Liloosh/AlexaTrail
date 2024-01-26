using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.RefDTO;
using backend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        [Route("nameRefGroup")]
        public async Task<IActionResult> GetRefGroupByName(string name)
        {
            var refsGroup = await appDbContext.RefsGroup.FirstOrDefaultAsync(r => r.Name == name);

            if (refsGroup == null)
            {
                return BadRequest();
            }

            var refsList = await refRepository.getAllRefs(refsGroup.Id);

            return Ok(refsList);
        }


        [HttpPost]
        [Route("{refsGroupId:Guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateRef([FromRoute]Guid refsGroupId, [FromBody] List<CreateRefDTO> refs)
        {
            var refsList = await refRepository.getAllRefs(refsGroupId);

            bool result = await refRepository.createNewRef(refsGroupId, refs, refsList);

            if (result)
            {
                return Ok("Success");
            }
            return BadRequest("Something was wrong");
        }

        [HttpGet]
        [Route("{refsId:Guid}")]
        [Authorize]
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
                [Authorize]
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
